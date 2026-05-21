/**
 * GameEnvScore stub — satisfies the dynamic import in GameEnv.initScoreManager().
 * The training hub tracks score via arrowScore in TrainingHubBaseGame.js;
 * this class is a no-op so the engine has a valid ScoreManager instance.
 */
export default class GameEnvScore {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    this.score = 0;
  }

  addScore(points) {
    this.score += points || 0;
  }

  getScore() {
    return this.score;
  }

  reset() {
    this.score = 0;
  }

  // Called by Game.js._ensureActiveScoreManager() — no-op in training hub
  updateScoreDisplay(_value) {}
}
