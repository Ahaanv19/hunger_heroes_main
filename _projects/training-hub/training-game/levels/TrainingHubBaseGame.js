import { GameCore } from '../../../../GameEnginev1.1/essentials/Game.js';
import GameControl from '../../../../GameEnginev1.1/essentials/GameControl.js';
import TrainingHubMissionLevel from './TrainingHubMissionLevel.js';

const NPC_IDS = [
  'BriefingStation',
  'IntakeStation',
  'MatchingStation',
  'DispatchStation',
  'VerificationStation',
];
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
    return 'Launch the training run, then use WASD to move and E to interact with your first checkpoint.';
  }

  if (visitedCount >= totalCount) {
    return 'Mission complete - you cleared every checkpoint on the Training Hub floor.';
  }

  const remaining = totalCount - visitedCount;
  return `Keep exploring - ${remaining} ${remaining === 1 ? 'checkpoint' : 'checkpoints'} left to complete the training run.`;
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
  const openedDialogueBoxes = new Map();
  const visitedNpcs = new Set();

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

  const syncViewport = () => {
    window.dispatchEvent(new Event('resize'));

    const activeControl = gameInstance?.activeGameControl || gameInstance?.gameControl;
    const currentLevel = activeControl?.currentLevel;

    if (currentLevel && typeof currentLevel.resize === 'function') {
      window.requestAnimationFrame(() => {
        currentLevel.resize();
      });
    }
  };

  const updateStats = () => {
    const visitedCount = visitedNpcs.size;
    const completion = Math.round((visitedCount / NPC_IDS.length) * 100);

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
  };

  const hideOverlay = () => {
    overlay.hidden = true;
  };

  const showOverlay = () => {
    overlay.hidden = false;
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
          dialoguesCompleted += 1;

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

    if (gameStarted) {
      container.focus();
      return;
    }

    gameStarted = true;
    gameStartTime = Date.now();

    if (statusBadge) {
      statusBadge.textContent = 'Training live';
    }

    updateStats();
    startClock();
    startDialogueTracker();

    gameInstance = GameCore.main(
      {
        path: options.basePath || '',
        gameContainer: container,
        gameCanvas: canvas,
        gameLevelClasses: [TrainingHubMissionLevel],
        disablePauseMenu: true,
        disableContainerAdjustment: true,
      },
      GameControl,
    );

    syncViewport();

    if (gameInstance && options.onStart instanceof Function) {
      options.onStart(gameInstance);
    }
  };

  startButtons.forEach((button) => {
    button.addEventListener('click', startGame);
  });

  helpButtons.forEach((button) => {
    button.addEventListener('click', showOverlay);
  });

  fullscreenButtons.forEach((button) => {
    button.addEventListener('click', toggleFullscreen);
  });

  overlay.addEventListener('click', (event) => {
    if (event.target.matches('[data-training-game-dismiss]')) {
      hideOverlay();
    }
  });

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  updateStats();
  updateFullscreenButtons();

  return {
    start: startGame,
    showHelp: showOverlay,
    toggleFullscreen,
    getState: () => ({
      gameStarted,
      dialoguesCompleted,
      visitedStations: Array.from(visitedNpcs),
    }),
  };
}

export default initTrainingHubBaseGame;
