import { GameCore } from '../../../../GameEnginev1.1/essentials/Game.js';
import GameControl from '../../../../GameEnginev1.1/essentials/GameControl.js';
import {
  TRAINING_HUB_CLASSIFIER_BONUS_PER_CORRECT,
  TRAINING_HUB_LEVEL_ID,
  computeTrainingHubScore,
  createTrainingHubSession,
  fetchTrainingHubLeaderboard,
  saveTrainingHubSession,
} from './TrainingHubSessionApi.js';
import { TRAINING_HUB_CHECKPOINT_IDS } from './TrainingHubMissionConfig.js';
import TrainingHubMissionLevel from './TrainingHubMissionLevel.js';

const NPC_IDS = TRAINING_HUB_CHECKPOINT_IDS;
const LEADERBOARD_LIMIT = 5;
const FULLSCREEN_COPY = {
  enter: 'Go full screen',
  exit: 'Exit full screen',
};
const CLASSIFIER_ROUND_POINTS = TRAINING_HUB_CLASSIFIER_BONUS_PER_CORRECT;
const CLASSIFIER_SCENARIOS = [
  {
    id: 'sealed-cans',
    title: 'Sealed canned vegetables',
    description: 'Factory-sealed cans with intact labels and no dents or rust.',
    decisionLabel: 'Accept for donation',
    valid: true,
    reason: 'Shelf-stable, unopened donations with readable labels are safe to accept.',
  },
  {
    id: 'opened-granola',
    title: 'Opened granola bars',
    description: 'The box is already open and individual bars are missing.',
    decisionLabel: 'Reject from donation',
    valid: false,
    reason: 'Opened food is not safe to redistribute because tampering cannot be verified.',
  },
  {
    id: 'fresh-apples',
    title: 'Fresh apples in produce crate',
    description: 'Clean fruit with no bruising, mold, or leakage in the crate.',
    decisionLabel: 'Accept for donation',
    valid: true,
    reason: 'Fresh produce can be accepted when it is clean, intact, and handled safely.',
  },
  {
    id: 'expired-yogurt',
    title: 'Expired yogurt cups',
    description: 'Refrigerated yogurt passed its use-by date three days ago.',
    decisionLabel: 'Reject from donation',
    valid: false,
    reason: 'Expired refrigerated items should fail intake because food safety is compromised.',
  },
  {
    id: 'frozen-meals',
    title: 'Frozen meals kept at temperature',
    description: 'Meals arrived solidly frozen in insulated carriers with labels attached.',
    decisionLabel: 'Accept for donation',
    valid: true,
    reason: 'Properly stored frozen food can pass intake when it stays frozen and labeled.',
  },
  {
    id: 'bulging-jar',
    title: 'Bulging pasta sauce jar',
    description: 'Glass jar lid is raised and the seal appears compromised.',
    decisionLabel: 'Reject from donation',
    valid: false,
    reason: 'Bulging containers can indicate spoilage or contamination and must be rejected.',
  },
];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const getMissionCopy = (visitedCount, totalCount) => {
  if (visitedCount === 0) {
    return 'Launch the starter map, then use WASD to move and E to interact with your first checkpoint.';
  }

  if (visitedCount >= totalCount) {
    return 'Mission complete - you cleared every starter checkpoint and the map is ready for team-specific content.';
  }

  const remaining = totalCount - visitedCount;
  return `Keep exploring - ${remaining} ${remaining === 1 ? 'checkpoint' : 'checkpoints'} left to complete the starter map.`;
};

const formatSavedAt = (value) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Saved recently';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsedDate);
};

const getSourceCopy = (source) => {
  switch (source) {
    case 'spring':
      return 'Spring sync';
    case 'local':
      return 'Local fallback';
    case 'offline':
      return 'Offline cache';
    default:
      return 'Unavailable';
  }
};

const getSaveSignature = (session) => [
  session.score,
  session.time_played_seconds,
].join('|');

const buildLeaderboardItem = (entry, index) => {
  const item = document.createElement('li');
  const rank = document.createElement('span');
  const copy = document.createElement('div');
  const title = document.createElement('strong');
  const meta = document.createElement('span');
  const score = document.createElement('span');

  item.className = 'training-hub-game__leaderboard-item';
  rank.className = 'training-hub-game__leaderboard-rank';
  copy.className = 'training-hub-game__leaderboard-copy';
  meta.className = 'training-hub-game__leaderboard-meta';
  score.className = 'training-hub-game__leaderboard-score';

  rank.textContent = `#${index + 1}`;
  title.textContent = entry.player_name || 'Volunteer';
  meta.textContent = `${entry.checkpoints_visited}/${entry.checkpoints_total} checkpoints - ${entry.dialogues_completed} dialogues - ${formatTime(entry.time_played_seconds)} - ${formatSavedAt(entry.created_at)}`;
  score.textContent = `${entry.score} pts`;

  copy.append(title, meta);
  item.append(rank, copy, score);

  return item;
};

export function initTrainingHubBaseGame(root, options = {}) {
  if (!root) {
    console.warn('TrainingHubBaseGame: training game root element not found.');
    return null;
  }

  const overlay = root.querySelector('[data-training-game-overlay]');
  const stage = root.querySelector('#gameArea');
  const container = root.querySelector('#gameContainer');
  const canvas = root.querySelector('#gameCanvas');
  const startButtons = root.querySelectorAll('[data-training-game-start]');
  const helpButtons = root.querySelectorAll('[data-training-game-help]');
  const fullscreenButtons = root.querySelectorAll('[data-training-game-fullscreen]');
  const progressLabel = root.querySelector('[data-training-game-progress-label]');
  const progressFill = root.querySelector('[data-training-game-progress-fill]');
  const stationStat = root.querySelector('[data-training-game-stat="stations"]');
  const dialogueStat = root.querySelector('[data-training-game-stat="dialogues"]');
  const timeStat = root.querySelector('[data-training-game-stat="time"]');
  const statusBadge = root.querySelector('[data-training-game-status]');
  const missionText = root.querySelector('[data-training-game-mission]');
  const feedbackText = root.querySelector('[data-training-game-feedback]');
  const leaderboardList = root.querySelector('[data-training-game-leaderboard]');
  const leaderboardSource = root.querySelector('[data-training-game-source]');
  const classifierPanel = root.querySelector('[data-training-game-classifier]');
  const saveButton = root.querySelector('[data-training-game-save]');
  const refreshButton = root.querySelector('[data-training-game-refresh]');
  const pauseButton = root.querySelector('[data-training-game-pause]');
  const pauseMenu = root.querySelector('[data-training-game-pause-menu]');
  const resumeButton = root.querySelector('[data-training-game-resume]');
  const exitButton = root.querySelector('[data-training-game-exit]');
  const scoreDisplay = root.querySelector('[data-training-game-score]');
  const arrowButtons = root.querySelectorAll('[data-training-game-arrow]');

  if (!container || !canvas || !overlay) {
    console.warn('TrainingHubBaseGame: required training game elements were not found.', {
      hasContainer: Boolean(container),
      hasCanvas: Boolean(canvas),
      hasOverlay: Boolean(overlay),
    });
    return null;
  }

  let gameInstance = null;
  let gameStarted = false;
  let gameStartTime = null;
  let dialoguePollId = null;
  let timerId = null;
  let dialoguesCompleted = 0;
  let arrowScore = 0;
  let classifierIndex = 0;
  let classifierAttempts = 0;
  let classifierCorrect = 0;
  let resizeObserver = null;
  // true  = item is valid  (pass arrow awards points)
  // false = item is invalid (fail arrow awards points)
  let currentItemValid = true;
  let lastSavedSignature = null;
  const classifierResults = new Map();
  const openedDialogueBoxes = new Map();
  const completedDialogueBoxes = new Set();
  const visitedNpcs = new Set();

  const getElapsedSeconds = () => (gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0);

  const getCurrentScenario = () => CLASSIFIER_SCENARIOS[classifierIndex] || null;

  const getTotalScore = () => {
    if (!gameStarted) {
      return 0;
    }

    return computeTrainingHubScore({
      checkpointsVisited: visitedNpcs.size,
      dialoguesCompleted,
      timePlayedSeconds: getElapsedSeconds(),
    }) + arrowScore;
  };

  const syncCurrentScenario = () => {
    currentItemValid = getCurrentScenario()?.valid ?? true;
  };

  const renderClassifier = () => {
    if (!classifierPanel) {
      return;
    }

    const currentScenario = getCurrentScenario();

    if (!currentScenario) {
      classifierPanel.innerHTML = [
        '<div class="training-hub-game__classifier-card training-hub-game__classifier-card--complete">',
        '<p class="training-hub-game__classifier-eyebrow">Classifier complete</p>',
        '<h4>All intake checks finished</h4>',
        `<p>You cleared ${classifierCorrect}/${CLASSIFIER_SCENARIOS.length} donation decisions. Save your run to publish the score to the leaderboard.</p>`,
        `<p class="training-hub-game__classifier-meta">Attempts: ${classifierAttempts} · Bonus score earned: ${arrowScore}</p>`,
        '</div>',
      ].join('');
      return;
    }

    const currentResult = classifierResults.get(currentScenario.id);
    const progressLabel = `Decision ${Math.min(classifierIndex + 1, CLASSIFIER_SCENARIOS.length)} of ${CLASSIFIER_SCENARIOS.length}`;
    const statusCopy = currentResult
      ? `<span class="training-hub-game__classifier-status" data-classifier-status="${currentResult.correct ? 'correct' : 'incorrect'}">${currentResult.correct ? 'Last answer correct' : 'Retry this item'}</span>`
      : '';
    const decisionCopy = currentResult
      ? `<div><dt>Expected action</dt><dd>${currentScenario.decisionLabel}</dd></div>`
      : '<div><dt>Focus</dt><dd>Check packaging, freshness, storage temperature, and visible damage before choosing pass or fail.</dd></div>';
    const reasonCopy = currentResult
      ? `<p class="training-hub-game__classifier-reason">${currentScenario.reason}</p>`
      : '<p class="training-hub-game__classifier-reason">Choose Pass only for donations that are safe, sealed when needed, properly labeled, and within date.</p>';

    classifierPanel.innerHTML = [
      '<div class="training-hub-game__classifier-card">',
      `<div class="training-hub-game__classifier-header"><p class="training-hub-game__classifier-eyebrow">Donation intake</p><span class="training-hub-game__classifier-progress">${progressLabel}</span></div>`,
      `<h4>${currentScenario.title}</h4>`,
      `<p>${currentScenario.description}</p>`,
      '<dl class="training-hub-game__classifier-details">',
      decisionCopy,
      `<div><dt>Scoring</dt><dd>+${CLASSIFIER_ROUND_POINTS} points for a correct pass or fail decision</dd></div>`,
      '</dl>',
      '<div class="training-hub-game__classifier-footer">',
      reasonCopy,
      statusCopy,
      '</div>',
      '</div>',
    ].join('');
  };

  const setFeedback = (message) => {
    if (feedbackText) {
      feedbackText.textContent = message;
    }
  };

  const setButtonBusy = (button, busyLabel) => {
    if (!button) {
      return;
    }

    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent;
    }

    button.disabled = true;
    button.textContent = busyLabel;
  };

  const clearButtonBusy = (button) => {
    if (!button) {
      return;
    }

    button.disabled = false;

    if (button.dataset.defaultLabel) {
      button.textContent = button.dataset.defaultLabel;
    }
  };

  const getActiveControl = () => gameInstance?.getActiveControl?.() || gameInstance?.activeGameControl || gameInstance?.gameControl || null;

  const pauseActiveGame = () => {
    const activeControl = getActiveControl();

    if (activeControl && !activeControl.isPaused && typeof activeControl.pause === 'function') {
      activeControl.pause();
    }
  };

  const resumeActiveGame = () => {
    const activeControl = getActiveControl();

    if (activeControl && activeControl.isPaused && typeof activeControl.resume === 'function') {
      activeControl.resume();
    }
  };

  const getFullscreenElement = () => (
    document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement
    || null
  );

  const canToggleFullscreen = Boolean(
    stage
    && (stage.requestFullscreen
      || stage.webkitRequestFullscreen
      || stage.mozRequestFullScreen
      || stage.msRequestFullscreen)
  );

  const getViewportDimensions = () => ({
    innerWidth: Math.max(container.clientWidth || stage?.clientWidth || 1, 1),
    innerHeight: Math.max(container.clientHeight || stage?.clientHeight || 1, 1),
  });

  const syncViewport = () => {
    const viewport = getViewportDimensions();

    if (gameInstance?.environment) {
      gameInstance.environment.innerWidth = viewport.innerWidth;
      gameInstance.environment.innerHeight = viewport.innerHeight;
    }

    const activeControl = gameInstance?.activeGameControl || gameInstance?.gameControl;
    const currentLevel = activeControl?.currentLevel;

    if (currentLevel && typeof currentLevel.resize === 'function') {
      window.requestAnimationFrame(() => {
        currentLevel.resize();
      });
    }
  };

  const scheduleViewportSync = () => {
    if (gameStarted) {
      window.requestAnimationFrame(syncViewport);
    }
  };

  const updateStats = () => {
    const visitedCount = visitedNpcs.size;
    const completion = NPC_IDS.length > 0 ? Math.round((visitedCount / NPC_IDS.length) * 100) : 0;

    if (stationStat) {
      stationStat.textContent = `${visitedCount}/${NPC_IDS.length}`;
    }

    if (dialogueStat) {
      dialogueStat.textContent = `${dialoguesCompleted}`;
    }

    if (timeStat) {
      const elapsed = getElapsedSeconds();
      timeStat.textContent = formatTime(elapsed);
    }

    if (progressLabel) {
      progressLabel.textContent = `${completion}% complete`;
    }

    if (progressFill) {
      progressFill.style.width = `${completion}%`;
    }

    if (missionText) {
      missionText.textContent = getMissionCopy(visitedCount, NPC_IDS.length);
    }

    if (scoreDisplay) {
      scoreDisplay.textContent = getTotalScore();
    }
  };

  const hideOverlay = () => {
    overlay.hidden = true;
  };

  const showOverlay = () => {
    overlay.hidden = false;
  };

  const renderLeaderboard = (entries, source) => {
    if (leaderboardSource) {
      leaderboardSource.textContent = getSourceCopy(source);
    }

    if (!leaderboardList) {
      return;
    }

    leaderboardList.replaceChildren();

    if (!entries.length) {
      const emptyState = document.createElement('li');
      emptyState.className = 'training-hub-game__leaderboard-empty';
      emptyState.textContent = 'No saved training runs yet. Finish a route and save it to create the first entry.';
      leaderboardList.append(emptyState);
      return;
    }

    entries.forEach((entry, index) => {
      leaderboardList.append(buildLeaderboardItem(entry, index));
    });
  };

  const loadLeaderboard = async ({ preserveFeedback = false } = {}) => {
    if (leaderboardSource) {
      leaderboardSource.textContent = 'Loading...';
    }

    setButtonBusy(refreshButton, 'Loading...');

    try {
      const { data, source } = await fetchTrainingHubLeaderboard(LEADERBOARD_LIMIT);
      renderLeaderboard(data, source);

      if (!preserveFeedback) {
        if (source === 'spring') {
          setFeedback('Recent training runs loaded from Spring.');
        } else if (source === 'local') {
          setFeedback('Showing locally saved runs until Spring is available.');
        } else {
          setFeedback('No saved training runs yet. Finish a route and save it to seed the leaderboard.');
        }
      }

      return { data, source };
    } catch (error) {
      console.warn('TrainingHubBaseGame: failed to load leaderboard.', error);
      renderLeaderboard([], 'offline');

      if (!preserveFeedback) {
        setFeedback('The leaderboard is unavailable right now. Local saves will still appear here when available.');
      }

      return { data: [], source: 'offline' };
    } finally {
      clearButtonBusy(refreshButton);
    }
  };

  const getSessionSnapshot = () => {
    const session = createTrainingHubSession({
      playerName: options.playerName,
      levelId: TRAINING_HUB_LEVEL_ID,
      checkpointsVisited: visitedNpcs.size,
      checkpointsTotal: NPC_IDS.length,
      dialoguesCompleted,
      timePlayedSeconds: getElapsedSeconds(),
      visitedCheckpoints: Array.from(visitedNpcs),
    });

    return {
      ...session,
      score: getTotalScore(),
      payload: {
        ...session.payload,
        classifier: {
          totalScenarios: CLASSIFIER_SCENARIOS.length,
          attempts: classifierAttempts,
          correct: classifierCorrect,
          bonusScore: arrowScore,
        },
      },
    };
  };

  const saveRun = async ({ quiet = false } = {}) => {
    if (!gameStarted || !gameStartTime) {
      if (!quiet) {
        setFeedback('Start the map before saving a training run.');
      }

      return { saved: false, reason: 'not-started' };
    }

    const session = getSessionSnapshot();
    const signature = getSaveSignature(session);

    if (signature === lastSavedSignature) {
      if (!quiet) {
        setFeedback('This run is already saved. Explore a little more before saving again.');
      }

      return { saved: false, reason: 'duplicate' };
    }

    setButtonBusy(saveButton, 'Saving run...');

    if (statusBadge) {
      statusBadge.textContent = 'Saving run';
    }

    try {
      const { data, source } = await saveTrainingHubSession(session);
      lastSavedSignature = signature;

      if (statusBadge) {
        statusBadge.textContent = source === 'spring' ? 'Synced to Spring' : 'Saved locally';
      }

      if (!quiet) {
        setFeedback(`Saved ${data.player_name}'s run with ${data.score} points via ${getSourceCopy(source).toLowerCase()}.`);
      }

      await loadLeaderboard({ preserveFeedback: quiet });

      return { saved: true, data, source };
    } catch (error) {
      console.warn('TrainingHubBaseGame: failed to save training run.', error);

      if (statusBadge) {
        statusBadge.textContent = 'Save unavailable';
      }

      if (!quiet) {
        setFeedback('This run could not be saved right now. Please try again after making more progress.');
      }

      return { saved: false, reason: 'error', error };
    } finally {
      clearButtonBusy(saveButton);
    }
  };

  const showPauseMenu = () => {
    pauseActiveGame();

    if (pauseMenu) {
      pauseMenu.hidden = false;
    }

    if (statusBadge) {
      statusBadge.textContent = 'Run paused';
    }
  };

  const hidePauseMenu = () => {
    if (pauseMenu) {
      pauseMenu.hidden = true;
    }
  };

  const resumeSession = () => {
    hidePauseMenu();
    hideOverlay();

    if (gameStarted) {
      resumeActiveGame();

      if (statusBadge) {
        statusBadge.textContent = 'Starter map live';
      }

      container.focus();
      scheduleViewportSync();
    }
  };

  const updateFullscreenButtons = () => {
    const isFullscreen = getFullscreenElement() === stage;

    fullscreenButtons.forEach((button) => {
      if (!canToggleFullscreen) {
        button.hidden = true;
        return;
      }

      button.hidden = false;
      button.textContent = isFullscreen ? FULLSCREEN_COPY.exit : FULLSCREEN_COPY.enter;
      button.setAttribute('aria-pressed', String(isFullscreen));
    });
  };

  const requestStageFullscreen = () => {
    const request = stage?.requestFullscreen
      || stage?.webkitRequestFullscreen
      || stage?.mozRequestFullScreen
      || stage?.msRequestFullscreen;

    if (!request) {
      return Promise.resolve();
    }

    return Promise.resolve(request.call(stage));
  };

  const exitStageFullscreen = () => {
    const exit = document.exitFullscreen
      || document.webkitExitFullscreen
      || document.mozCancelFullScreen
      || document.msExitFullscreen;

    if (!exit) {
      return Promise.resolve();
    }

    return Promise.resolve(exit.call(document));
  };

  const toggleFullscreen = async () => {
    if (!canToggleFullscreen) {
      return;
    }

    try {
      if (getFullscreenElement() === stage) {
        await exitStageFullscreen();
      } else {
        await requestStageFullscreen();
      }
    } catch (error) {
      console.warn('TrainingHubBaseGame: fullscreen toggle failed.', error);
    }
  };

  const handleFullscreenChange = () => {
    updateFullscreenButtons();
    window.requestAnimationFrame(() => {
      syncViewport();

      if (gameStarted) {
        container.focus();
      }
    });
  };

  const startClock = () => {
    if (timerId) {
      window.clearInterval(timerId);
    }

    timerId = window.setInterval(() => {
      updateStats();
    }, 1000);
  };

  const startDialogueTracker = () => {
    if (dialoguePollId) {
      return;
    }

    dialoguePollId = window.setInterval(() => {
      const dialogueBoxes = document.querySelectorAll('[id^="custom-dialogue-box-"]');

      dialogueBoxes.forEach((box) => {
        const isVisible = window.getComputedStyle(box).display !== 'none';
        const wasVisible = openedDialogueBoxes.get(box.id) || false;

        if (isVisible && !wasVisible) {
          if (!completedDialogueBoxes.has(box.id)) {
            completedDialogueBoxes.add(box.id);
            dialoguesCompleted = completedDialogueBoxes.size;
          }

          for (const npcId of NPC_IDS) {
            if (box.id.includes(npcId)) {
              visitedNpcs.add(npcId);
              break;
            }
          }

          updateStats();
        }

        openedDialogueBoxes.set(box.id, isVisible);
      });
    }, 250);
  };

  const startGame = () => {
    hideOverlay();
    hidePauseMenu();

    if (gameStarted) {
      resumeSession();
      return;
    }

    gameStarted = true;
    gameStartTime = Date.now();
    dialoguesCompleted = 0;
    openedDialogueBoxes.clear();
    completedDialogueBoxes.clear();
    visitedNpcs.clear();
    lastSavedSignature = null;
    arrowScore = 0;
    classifierIndex = 0;
    classifierAttempts = 0;
    classifierCorrect = 0;
    classifierResults.clear();
    syncCurrentScenario();
    renderClassifier();

    if (statusBadge) {
      statusBadge.textContent = 'Starter map live';
    }

    setFeedback('Explore the starter map, then save a run to sync it to Spring or keep it locally while the backend is offline.');

    updateStats();
    startClock();
    startDialogueTracker();

    gameInstance = GameCore.main(
      {
        path: options.basePath || '',
        gameContainer: container,
        gameCanvas: canvas,
        ...getViewportDimensions(),
        gameLevelClasses: [TrainingHubMissionLevel],
        disablePauseMenu: true,
        disableContainerAdjustment: true,
      },
      GameControl,
    );

    scheduleViewportSync();
    container.focus();

    if (gameInstance && typeof options.onStart === 'function') {
      options.onStart(gameInstance);
    }

    void loadLeaderboard({ preserveFeedback: true });
  };

  const showHelp = () => {
    if (gameStarted) {
      pauseActiveGame();

      if (statusBadge) {
        statusBadge.textContent = 'Reviewing controls';
      }
    }

    hidePauseMenu();
    showOverlay();
  };

  const handleExit = async () => {
    const saveResult = await saveRun({ quiet: true });

    hidePauseMenu();
    showOverlay();
    pauseActiveGame();

    if (statusBadge) {
      statusBadge.textContent = 'Run paused';
    }

    if (saveResult.saved) {
      setFeedback(`Run paused after saving ${saveResult.data.score} points via ${getSourceCopy(saveResult.source).toLowerCase()}. Use Start game to resume.`);
    } else {
      setFeedback('Run paused. Use Start game to resume.');
    }
  };

  let arrowFlashTimer = null;

  const flashArrowFeedback = (button, correct) => {
    if (arrowFlashTimer) {
      window.clearTimeout(arrowFlashTimer);
    }

    arrowButtons.forEach((b) => b.removeAttribute('data-arrow-result'));
    button.setAttribute('data-arrow-result', correct ? 'correct' : 'incorrect');

    arrowFlashTimer = window.setTimeout(() => {
      button.removeAttribute('data-arrow-result');
    }, 800);
  };

  arrowButtons.forEach((button) => {
    const arrowType = button.dataset.trainingGameArrow; // 'pass' or 'fail'
    button.addEventListener('click', () => {
      if (!gameStarted) {
        return;
      }

      const currentScenario = getCurrentScenario();

      if (!currentScenario) {
        setFeedback('All pass/fail items are already complete. Save your run to update the leaderboard.');
        return;
      }

      const correct =
        (arrowType === 'pass' && currentItemValid === true) ||
        (arrowType === 'fail' && currentItemValid === false);

      classifierAttempts += 1;
      classifierResults.set(currentScenario.id, { correct, arrowType });

      if (correct) {
        arrowScore += CLASSIFIER_ROUND_POINTS;
        classifierCorrect += 1;
        classifierIndex += 1;
        syncCurrentScenario();
        updateStats();
        renderClassifier();
        setFeedback(arrowType === 'pass' ? 'Correct! Item accepted and score added.' : 'Correct! Item rejected and score added.');
      } else {
        renderClassifier();
        setFeedback(arrowType === 'pass' ? 'Wrong! That item should be rejected.' : 'Wrong! That item should be accepted.');
      }

      flashArrowFeedback(button, correct);
    });
  });

  startButtons.forEach((button) => {
    button.addEventListener('click', startGame);
  });

  helpButtons.forEach((button) => {
    button.addEventListener('click', showHelp);
  });

  fullscreenButtons.forEach((button) => {
    button.addEventListener('click', toggleFullscreen);
  });

  if (saveButton) {
    saveButton.addEventListener('click', () => {
      void saveRun();
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      void loadLeaderboard();
    });
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      if (!gameStarted) {
        showOverlay();
        return;
      }

      showPauseMenu();
    });
  }

  if (resumeButton) {
    resumeButton.addEventListener('click', resumeSession);
  }

  if (exitButton) {
    exitButton.addEventListener('click', () => {
      void handleExit();
    });
  }

  overlay.addEventListener('click', (event) => {
    if (event.target.matches('[data-training-game-dismiss]')) {
      if (gameStarted) {
        resumeSession();
      } else {
        hideOverlay();
      }
    }
  });

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
  window.addEventListener('resize', scheduleViewportSync);
  window.addEventListener('orientationchange', scheduleViewportSync);

  if (typeof window.ResizeObserver === 'function') {
    resizeObserver = new window.ResizeObserver(() => {
      scheduleViewportSync();
    });
    resizeObserver.observe(container);

    if (stage && stage !== container) {
      resizeObserver.observe(stage);
    }
  }

  updateStats();
  syncCurrentScenario();
  renderClassifier();
  updateFullscreenButtons();
  void loadLeaderboard();

  return {
    start: startGame,
    save: () => saveRun(),
    showHelp,
    refreshLeaderboard: () => loadLeaderboard(),
    toggleFullscreen,
    getState: () => ({
      gameStarted,
      classifierAttempts,
      classifierCorrect,
      dialoguesCompleted,
      visitedCheckpoints: Array.from(visitedNpcs),
      resizeObserverActive: Boolean(resizeObserver),
    }),
  };
}

export default initTrainingHubBaseGame;
