import { fetchOptions, javaURI } from '../../../../api/config.js';

export const TRAINING_HUB_LEVEL_ID = 'training-hub-team-starter-map';
export const TRAINING_HUB_CLASSIFIER_BONUS_PER_CORRECT = 5;

const LOCAL_STORAGE_KEY = 'trainingHubGameSessions';
const TRAINING_HUB_ENDPOINT = '/api/training-hub/sessions';
const TRAINING_HUB_LEADERBOARD_ENDPOINT = `${TRAINING_HUB_ENDPOINT}/leaderboard`;

const toInteger = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatIsoDate = (value) => {
  const parsedDate = value ? new Date(value) : new Date();
  return Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
};

const parsePayload = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      return { raw: value };
    }
  }

  if (typeof value === 'object') {
    return value;
  }

  return {};
};

const getStoredPlayerName = () => {
  try {
    return localStorage.getItem('username') || localStorage.getItem('name') || 'Volunteer';
  } catch (error) {
    return 'Volunteer';
  }
};

export function computeTrainingHubScore({ checkpointsVisited = 0, dialoguesCompleted = 0, timePlayedSeconds = 0 } = {}) {
  return (Math.max(0, toInteger(checkpointsVisited)) * 100)
    + (Math.max(0, toInteger(dialoguesCompleted)) * 25)
    + Math.max(0, 300 - Math.max(0, toInteger(timePlayedSeconds)));
}

const computeClassifierBonus = (payload = {}) => {
  const classifier = parsePayload(payload).classifier;

  if (!classifier || typeof classifier !== 'object') {
    return 0;
  }

  const correct = Math.max(0, toInteger(classifier.correct));
  const totalScenarios = Math.max(toInteger(classifier.totalScenarios, correct), correct);

  return Math.min(correct, totalScenarios) * TRAINING_HUB_CLASSIFIER_BONUS_PER_CORRECT;
};

const normalizeSession = (entry = {}) => {
  const payload = parsePayload(entry.payload ?? entry.details);
  const checkpoints = Array.isArray(entry.checkpoints)
    ? entry.checkpoints.filter(Boolean)
    : Array.isArray(payload.checkpoints)
      ? payload.checkpoints.filter(Boolean)
      : [];

  const checkpointsVisited = Math.max(
    toInteger(entry.checkpointsVisited ?? entry.checkpoints_visited, checkpoints.length),
    checkpoints.length,
  );
  const checkpointsTotal = Math.max(
    toInteger(entry.checkpointsTotal ?? entry.checkpoints_total, Math.max(checkpointsVisited, 1)),
    checkpointsVisited,
    1,
  );
  const dialoguesCompleted = Math.max(toInteger(entry.dialoguesCompleted ?? entry.dialogues_completed), 0);
  const timePlayedSeconds = Math.max(toInteger(entry.timePlayedSeconds ?? entry.time_played_seconds), 0);
  const completionRate = Math.max(
    0,
    Math.min(
      100,
      toInteger(
        entry.completionRate ?? entry.completion_rate,
        Math.round((checkpointsVisited / checkpointsTotal) * 100),
      ),
    ),
  );
  const classifierBonus = computeClassifierBonus(payload);

  return {
    id: entry.id ?? entry.sessionId ?? entry.session_id ?? null,
    player_name: entry.player_name ?? entry.playerName ?? getStoredPlayerName(),
    level_id: entry.level_id ?? entry.levelId ?? TRAINING_HUB_LEVEL_ID,
    checkpoints_total: checkpointsTotal,
    checkpoints_visited: Math.min(checkpointsVisited, checkpointsTotal),
    checkpoints,
    dialogues_completed: dialoguesCompleted,
    time_played_seconds: timePlayedSeconds,
    completion_rate: completionRate,
    completed: Boolean(entry.completed ?? entry.isCompleted ?? completionRate === 100),
    score: Math.max(
      toInteger(
        entry.score ?? entry.sessionScore ?? entry.session_score,
        computeTrainingHubScore({ checkpointsVisited, dialoguesCompleted, timePlayedSeconds }) + classifierBonus,
      ),
      0,
    ),
    created_at: formatIsoDate(entry.created_at ?? entry.createdAt),
    source: entry.source ?? payload.source ?? 'local',
    payload,
  };
};

const unwrapCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.sessions)) {
    return payload.sessions;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const sortSessions = (sessions) => [...sessions].sort((left, right) => {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if (right.completion_rate !== left.completion_rate) {
    return right.completion_rate - left.completion_rate;
  }

  if (right.checkpoints_visited !== left.checkpoints_visited) {
    return right.checkpoints_visited - left.checkpoints_visited;
  }

  if (left.time_played_seconds !== right.time_played_seconds) {
    return left.time_played_seconds - right.time_played_seconds;
  }

  return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
});

const getSessionSignature = (session) => [
  session.player_name,
  session.level_id,
  session.score,
  session.checkpoints_visited,
  session.dialogues_completed,
  session.time_played_seconds,
].join('|');

const readLocalSessions = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortSessions(parsed.map((session) => normalizeSession(session)));
  } catch (error) {
    console.warn('Training Hub: failed to read local sessions.', error);
    return [];
  }
};

const writeLocalSessions = (sessions) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.warn('Training Hub: failed to write local sessions.', error);
  }
};

const saveLocalSession = (session) => {
  const normalizedSession = normalizeSession(session);
  const signature = getSessionSignature(normalizedSession);
  const deduped = readLocalSessions().filter((existingSession) => getSessionSignature(existingSession) !== signature);
  const nextSessions = sortSessions([normalizedSession, ...deduped]).slice(0, 12);
  writeLocalSessions(nextSessions);
  return normalizedSession;
};

const requestJson = async (url, options = {}, timeoutMs = 7000) => {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP_${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } finally {
    window.clearTimeout(timeoutId);
  }
};

const buildSpringPayload = (session) => {
  const payload = parsePayload(session.payload);
  const details = {
    ...payload,
    checkpoints: session.checkpoints,
    completionRate: session.completion_rate,
    completed: session.completed,
    source: payload.source || 'training-hub-web',
  };

  return {
    playerName: session.player_name,
    levelId: session.level_id,
    checkpointsVisited: session.checkpoints_visited,
    checkpointsTotal: session.checkpoints_total,
    dialoguesCompleted: session.dialogues_completed,
    timePlayedSeconds: session.time_played_seconds,
    completionRate: session.completion_rate,
    completed: session.completed,
    score: session.score,
    checkpoints: session.checkpoints,
    details: JSON.stringify(details),
    payload: details,
    createdAt: session.created_at,
  };
};

export function createTrainingHubSession(input = {}) {
  const visitedCheckpoints = Array.isArray(input.visitedCheckpoints)
    ? Array.from(new Set(input.visitedCheckpoints.filter(Boolean)))
    : [];
  const checkpointsVisited = Math.max(
    toInteger(input.checkpointsVisited ?? input.checkpoints_visited, visitedCheckpoints.length),
    visitedCheckpoints.length,
  );
  const checkpointsTotal = Math.max(
    toInteger(input.checkpointsTotal ?? input.checkpoints_total, Math.max(checkpointsVisited, 1)),
    checkpointsVisited,
    1,
  );
  const dialoguesCompleted = Math.max(toInteger(input.dialoguesCompleted ?? input.dialogues_completed), 0);
  const timePlayedSeconds = Math.max(toInteger(input.timePlayedSeconds ?? input.time_played_seconds), 0);

  return normalizeSession({
    player_name: input.playerName || input.player_name || getStoredPlayerName(),
    level_id: input.levelId || input.level_id || TRAINING_HUB_LEVEL_ID,
    checkpoints_total: checkpointsTotal,
    checkpoints_visited: Math.min(checkpointsVisited, checkpointsTotal),
    checkpoints: visitedCheckpoints,
    dialogues_completed: dialoguesCompleted,
    time_played_seconds: timePlayedSeconds,
    completion_rate: Math.round((Math.min(checkpointsVisited, checkpointsTotal) / checkpointsTotal) * 100),
    completed: checkpointsVisited >= checkpointsTotal,
    score: computeTrainingHubScore({ checkpointsVisited, dialoguesCompleted, timePlayedSeconds }),
    created_at: input.createdAt || input.created_at || new Date().toISOString(),
    payload: {
      checkpoints: visitedCheckpoints,
      source: 'training-hub-web',
    },
    source: input.source || 'local',
  });
}

export async function saveTrainingHubSession(sessionInput) {
  const session = normalizeSession(sessionInput);
  let springRecord = null;

  try {
    springRecord = normalizeSession({
      ...(await requestJson(`${javaURI}${TRAINING_HUB_ENDPOINT}`, {
        method: 'POST',
        body: JSON.stringify(buildSpringPayload(session)),
      })),
      source: 'spring',
    });
  } catch (error) {
    console.info('Training Hub: Spring session save unavailable.', error.message);
  }

  const storedRecord = saveLocalSession(
    springRecord
      ? { ...session, ...springRecord, source: 'spring' }
      : { ...session, source: 'local' },
  );

  return {
    data: storedRecord,
    source: springRecord ? 'spring' : 'local',
  };
}

export async function fetchTrainingHubLeaderboard(limit = 5) {
  const safeLimit = Math.min(Math.max(toInteger(limit, 5), 1), 20);

  try {
    const search = new URLSearchParams({
      levelId: TRAINING_HUB_LEVEL_ID,
      limit: String(safeLimit),
    });
    const payload = await requestJson(`${javaURI}${TRAINING_HUB_LEADERBOARD_ENDPOINT}?${search.toString()}`, {
      method: 'GET',
    });
    const sessions = sortSessions(unwrapCollection(payload).map((session) => normalizeSession(session))).slice(0, safeLimit);

    if (sessions.length) {
      return {
        data: sessions,
        source: 'spring',
      };
    }
  } catch (error) {
    console.info('Training Hub: Spring leaderboard unavailable.', error.message);
  }

  const localSessions = sortSessions(
    readLocalSessions().filter((session) => session.level_id === TRAINING_HUB_LEVEL_ID),
  ).slice(0, safeLimit);

  return {
    data: localSessions,
    source: localSessions.length ? 'local' : 'offline',
  };
}