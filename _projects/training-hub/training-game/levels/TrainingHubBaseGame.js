import { GameCore } from '../../../../GameEnginev1.1/essentials/Game.js';
import GameControl from '../../../../GameEnginev1.1/essentials/GameControl.js';
import {
  TRAINING_HUB_LEVEL_ID,
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
  let resizeObserver = null;
  let lastSavedSignature = null;
  const openedDialogueBoxes = new Map();
  const completedDialogueBoxes = new Set();
  const visitedNpcs = new Set();

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
      const elapsed = gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0;
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
      scoreDisplay.textContent = arrowScore;
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
      timePlayedSeconds: gameStartTime ? Math.round((Date.now() - gameStartTime) / 1000) : 0,
      visitedCheckpoints: Array.from(visitedNpcs),
    });
    return { ...session, score: arrowScore };
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

  arrowButtons.forEach((button) => {
    button.addEventListener('click', () => {
      arrowScore += 5;
      updateStats();
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
      dialoguesCompleted,
      visitedCheckpoints: Array.from(visitedNpcs),
      resizeObserverActive: Boolean(resizeObserver),
    }),
  };
}

export default initTrainingHubBaseGame;
