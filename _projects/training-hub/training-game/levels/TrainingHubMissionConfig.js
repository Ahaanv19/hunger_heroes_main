const PROJECT_ASSET_ROOT = '/assets/projects/training-hub/training-game';

const checkpoint = ({ id, label, emoji, color, position, greeting, dialogues, assetPath = null }) => ({
  id,
  label,
  emoji,
  color,
  position,
  greeting,
  dialogues,
  assetPath,
});

const TRAINING_HUB_MISSION_CONFIG = {
  levelId: 'training-hub-team-starter-map',
  displayName: 'Team Starter Map',
  background: {
    name: 'Conveyor Belt Training Map',
    assetPath: `${PROJECT_ASSET_ROOT}/backgrounds/Conveyor_Background.png`,
    fallbackTheme: 'warehouse',
    pixels: { width: 1006, height: 508 },
  },
  hero: {
    id: 'TeamRunner',
    greeting: 'This runner uses the shared controls and physics.',
    assetPath: null,
    scaleFactor: 6,
    stepFactor: 800,
    animationRate: 50,
    startPosition: { x: 0.1, y: 0.78 },
    pixels: { height: 512, width: 512 },
    hitbox: { widthPercentage: 0.4, heightPercentage: 0.2 },
    // WASD movement: W=87, A=65, S=83, D=68
    keypress: { up: 87, left: 65, down: 83, right: 68 },
  },
  checkpoints: [
    checkpoint({
      id: 'WelcomeZone',
      label: 'START',
      emoji: '1',
      color: '#0ea5e9',
      position: { x: 0.16, y: 0.6 },
      greeting: 'Start Zone',
      dialogues: [
        'Use this starter map as a shell, not as a finished lesson.',
        'Keep the shared GameEngine v1.1 wiring and swap only the map content your team owns.',
        'The easiest first edit is the copy in TrainingHubMissionConfig.js.',
      ],
    }),
    checkpoint({
      id: 'ArtZone',
      label: 'ART',
      emoji: '2',
      color: '#7c3aed',
      position: { x: 0.33, y: 0.42 },
      greeting: 'Art Zone',
      dialogues: [
        'Place optional images in training-game/assets/backgrounds, characters, or checkpoints.',
        'The build copies that project directory into the site assets path for runtime use.',
        'If you leave assetPath empty, the starter map falls back to generated engine art.',
      ],
    }),
    checkpoint({
      id: 'CopyZone',
      label: 'COPY',
      emoji: '3',
      color: '#f59e0b',
      position: { x: 0.5, y: 0.58 },
      greeting: 'Copy Zone',
      dialogues: [
        'Each checkpoint in the config owns its own label, color, greeting, and dialogue list.',
        'You can turn these starter prompts into product walkthroughs, team scenarios, or onboarding steps.',
        'Keep the ids stable if you want the built-in progress tracker to continue working.',
      ],
    }),
    checkpoint({
      id: 'FlowZone',
      label: 'FLOW',
      emoji: '4',
      color: '#16a34a',
      position: { x: 0.68, y: 0.42 },
      greeting: 'Flow Zone',
      dialogues: [
        'Checkpoint positions are ratios, so the layout stays responsive inside the existing engine canvas.',
        'Reorder, add, or remove checkpoints in the config to change the shape of the lesson.',
        'The wrapper will keep tracking progress as long as the config remains the source of truth.',
      ],
    }),
    checkpoint({
      id: 'LaunchZone',
      label: 'GO',
      emoji: '5',
      color: '#dc2626',
      position: { x: 0.84, y: 0.6 },
      greeting: 'Launch Zone',
      dialogues: [
        'When the shell feels right, link outward to the live game, forms, or follow-up training pages.',
        'Run make -C _projects/training-hub build after updating the project files so the public assets stay in sync.',
        'This keeps customization local to the project directory instead of editing the game engine itself.',
      ],
    }),
  ],
};

export const TRAINING_HUB_ASSET_ROOT = PROJECT_ASSET_ROOT;
export const TRAINING_HUB_CHECKPOINT_IDS = TRAINING_HUB_MISSION_CONFIG.checkpoints.map((checkpointEntry) => checkpointEntry.id);

export default TRAINING_HUB_MISSION_CONFIG;