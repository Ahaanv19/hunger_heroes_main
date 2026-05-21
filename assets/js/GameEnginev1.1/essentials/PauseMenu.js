/**
 * PauseMenu stub — satisfies the dynamic import in Game.js._initializePauseFeature().
 * The training hub manages its own pause overlay via TrainingHubBaseGame.js,
 * so this class is a no-op to prevent the 404 error.
 */
export default class PauseMenu {
  constructor(gameControl) {
    this.gameControl = gameControl;
  }

  show() {
    if (this.gameControl?.pause) {
      this.gameControl.pause();
    }
  }

  hide() {
    if (this.gameControl?.resume) {
      this.gameControl.resume();
    }
  }
}
