import GameEnvBackground from '../../../../GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '../../../../GameEnginev1.1/essentials/Player.js';
import Npc from '../../../../GameEnginev1.1/essentials/Npc.js';
import SpriteGenerator from '../../../hunger-heroes-game/levels/SpriteGenerator.js';
import TRAINING_HUB_MISSION_CONFIG from './TrainingHubMissionConfig.js';

const HERO_SCALE = 6;

const resolveProjectAssetPath = (basePath, assetPath) => {
  if (!assetPath) {
    return null;
  }

  const normalizedBasePath = basePath && basePath !== '/' ? basePath.replace(/\/$/, '') : '';
  const normalizedAssetPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;

  return `${normalizedBasePath}${normalizedAssetPath}`;
};

const resolveSpriteSource = (gameEnv, assetPath, fallbackSource) => (
  resolveProjectAssetPath(gameEnv.path, assetPath) || fallbackSource
);

const resolvePosition = (width, height, position) => ({
  x: width * position.x,
  y: height * position.y,
});

const createCheckpoint = ({ id, label, emoji, color, position, greeting, dialogues, assetPath = null }, gameEnv, width, height) => ({
  id,
  greeting,
  src: resolveSpriteSource(gameEnv, assetPath, SpriteGenerator.createNpcSprite(emoji, color, label)),
  SCALE_FACTOR: 6,
  ANIMATION_RATE: 180,
  pixels: { width: 384, height: 128 },
  INIT_POSITION: resolvePosition(width, height, position),
  orientation: { rows: 1, columns: 3 },
  down: { row: 0, start: 0, columns: 3 },
  hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
  dialogues,
  interact: function () {
    this.showReactionDialogue();
  },
});

class TrainingHubMissionLevel {
  static levelId = TRAINING_HUB_MISSION_CONFIG.levelId;
  static displayName = TRAINING_HUB_MISSION_CONFIG.displayName;

  constructor(gameEnv) {
    const config = TRAINING_HUB_MISSION_CONFIG;
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    const bgData = {
      name: config.background.name,
      greeting: config.background.greeting,
      src: resolveSpriteSource(gameEnv, config.background.assetPath, SpriteGenerator.createBackground(config.background.fallbackTheme)),
      pixels: config.background.pixels,
    };

    const heroData = {
      id: config.hero.id,
      greeting: config.hero.greeting,
      src: resolveSpriteSource(gameEnv, config.hero.assetPath, SpriteGenerator.createHeroSprite()),
      SCALE_FACTOR: config.hero.scaleFactor || HERO_SCALE,
      STEP_FACTOR: config.hero.stepFactor || 800,
      ANIMATION_RATE: config.hero.animationRate || 50,
      INIT_POSITION: resolvePosition(width, height, config.hero.startPosition),
      pixels: config.hero.pixels,
      orientation: { rows: 4, columns: 4 },
      down: { row: 0, start: 0, columns: 4 },
      right: { row: 1, start: 0, columns: 4 },
      left: { row: 2, start: 0, columns: 4 },
      up: { row: 3, start: 0, columns: 4 },
      hitbox: config.hero.hitbox,
      keypress: config.hero.keypress,
    };

    const checkpoints = config.checkpoints.map((checkpoint) => createCheckpoint(checkpoint, gameEnv, width, height));

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: heroData },
      ...checkpoints.map((checkpoint) => ({ class: Npc, data: checkpoint })),
    ];
  }
}

export default TrainingHubMissionLevel;