import { GameCore } from '../../../../GameEnginev1.1/essentials/Game.js';
import GameControl from '../../../../GameEnginev1.1/essentials/GameControl.js';
import GameLevelHungerHeroes from '../../../hunger-heroes-game/levels/GameLevelHungerHeroes.js';

const NPC_IDS = ['CreateStation', 'BrowseStation', 'MatchStation', 'DeliverStation', 'ScanStation'];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
};

const getMissionCopy = (visitedCount, totalCount) => {
  if (visitedCount === 0) {
    return 'Launch the lesson, then use WASD to move and E to interact with your first station.';
  }

  if (visitedCount >= totalCount) {
    return 'Mission complete — you found every station in Base Game Part 1.';
  }

  const remaining = totalCount - visitedCount;
  return `Keep exploring — ${remaining} ${remaining === 1 ? 'station' : 'stations'} left to complete the lesson.`;
};

export function initTrainingHubBaseGame(root, options = {}) {
  if (!root) {
    console.warn('TrainingHubBaseGame: training game root element not found.');
    return null;
  }

  const overlay = root.querySelector('[data-training-game-overlay]');
  const container = root.querySelector('#gameContainer');
  const canvas = root.querySelector('#gameCanvas');
  const startButtons = root.querySelectorAll('[data-training-game-start]');
  const helpButtons = root.querySelectorAll('[data-training-game-help]');
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
      statusBadge.textContent = 'Live lesson';
    }

    updateStats();
    startClock();
    startDialogueTracker();

    gameInstance = GameCore.main(
      {
        path: options.basePath || '',
        gameContainer: container,
        gameCanvas: canvas,
        gameLevelClasses: [GameLevelHungerHeroes],
        disablePauseMenu: true,
        disableContainerAdjustment: true,
      },
      GameControl,
    );

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

  overlay.addEventListener('click', (event) => {
    if (event.target.matches('[data-training-game-dismiss]')) {
      hideOverlay();
    }
  });

  updateStats();

  return {
    start: startGame,
    showHelp: showOverlay,
    getState: () => ({
      gameStarted,
      dialoguesCompleted,
      visitedStations: Array.from(visitedNpcs),
    }),
  };
}

export default initTrainingHubBaseGame;
