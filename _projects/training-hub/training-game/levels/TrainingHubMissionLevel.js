import GameEnvBackground from '../../../../GameEnginev1.1/essentials/GameEnvBackground.js';
import Player from '../../../../GameEnginev1.1/essentials/Player.js';
import Npc from '../../../../GameEnginev1.1/essentials/Npc.js';
import SpriteGenerator from '../../../hunger-heroes-game/levels/SpriteGenerator.js';

const HERO_SCALE = 6;

const createCheckpoint = ({ id, label, emoji, color, position, greeting, dialogues }) => ({
  id,
  greeting,
  src: SpriteGenerator.createNpcSprite(emoji, color, label),
  SCALE_FACTOR: 6,
  ANIMATION_RATE: 180,
  pixels: { width: 384, height: 128 },
  INIT_POSITION: position,
  orientation: { rows: 1, columns: 3 },
  down: { row: 0, start: 0, columns: 3 },
  hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
  dialogues,
  interact: function () {
    this.showReactionDialogue();
  },
});

class TrainingHubMissionLevel {
  static levelId = 'training-hub-onboarding-floor';
  static displayName = 'Training Hub Onboarding';

  constructor(gameEnv) {
    const width = gameEnv.innerWidth;
    const height = gameEnv.innerHeight;

    const bgData = {
      name: 'Training Floor',
      greeting: 'Welcome to the Training Hub onboarding floor. Walk the checkpoints to rehearse the Hunger Heroes workflow before you open the live tools.',
      src: SpriteGenerator.createBackground('warehouse'),
      pixels: { height: 600, width: 1200 },
    };

    const heroData = {
      id: 'TrainingRunner',
      greeting: 'I am your training runner. Visit each checkpoint to practice the workflow, then jump into the full Hunger Heroes experience when you are ready.',
      src: SpriteGenerator.createHeroSprite(),
      SCALE_FACTOR: HERO_SCALE,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: width * 0.1, y: height - height / HERO_SCALE - 20 },
      pixels: { height: 512, width: 512 },
      orientation: { rows: 4, columns: 4 },
      down: { row: 0, start: 0, columns: 4 },
      right: { row: 1, start: 0, columns: 4 },
      left: { row: 2, start: 0, columns: 4 },
      up: { row: 3, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
    };

    const checkpoints = [
      createCheckpoint({
        id: 'BriefingStation',
        label: 'BRIEF',
        emoji: '🧭',
        color: '#0ea5e9',
        position: { x: width * 0.18, y: height * 0.58 },
        greeting: '🧭 Briefing Station: learn the route before you touch the live donor workflow.',
        dialogues: [
          '🧭 Start every training run here to understand the full Hunger Heroes loop.',
          '🗺️ The hub mirrors the real flow, but each checkpoint is tuned for practice instead of live data.',
          '🎯 Your job is to clear all five checkpoints and recognize how they connect.',
        ],
      }),
      createCheckpoint({
        id: 'IntakeStation',
        label: 'INTAKE',
        emoji: '📥',
        color: '#2563eb',
        position: { x: width * 0.34, y: height * 0.42 },
        greeting: '📥 Intake Station: rehearse how donations get entered and labeled.',
        dialogues: [
          '📥 Intake covers the same ideas as the create flow: item details, allergens, quantity, and expiry.',
          '🏷️ In training mode, focus on what information matters before the barcode is generated.',
          '🧠 When you open the live page, the form fields should already feel familiar.',
        ],
      }),
      createCheckpoint({
        id: 'MatchingStation',
        label: 'MATCH',
        emoji: '🤝',
        color: '#16a34a',
        position: { x: width * 0.52, y: height * 0.58 },
        greeting: '🤝 Matching Station: connect available donations to the right request profile.',
        dialogues: [
          '🤝 Matching is where supply meets need using location and food preferences.',
          '📍 Watch how the training route turns a list of donations into a targeted handoff.',
          '⚖️ The live tool adds filtering logic, but the decision pattern starts here.',
        ],
      }),
      createCheckpoint({
        id: 'DispatchStation',
        label: 'ROUTE',
        emoji: '🚚',
        color: '#f59e0b',
        position: { x: width * 0.68, y: height * 0.42 },
        greeting: '🚚 Dispatch Station: follow how a matched donation moves into delivery.',
        dialogues: [
          '🚚 Dispatch turns a good match into an actual delivery route.',
          '📋 Practice the status ladder so the live dashboard is easier to read later.',
          '🔄 In the full experience, these updates keep donors, receivers, and volunteers aligned.',
        ],
      }),
      createCheckpoint({
        id: 'VerificationStation',
        label: 'VERIFY',
        emoji: '✅',
        color: '#dc2626',
        position: { x: width * 0.84, y: height * 0.58 },
        greeting: '✅ Verification Station: confirm the handoff and close the loop.',
        dialogues: [
          '✅ Verification is the final checkpoint where labels, IDs, and delivery state all line up.',
          '🔎 This is where scan-and-check workflows make the system trustworthy.',
          '🚀 Finish here, then use the quick links below to jump into the live pages with context.',
        ],
      }),
    ];

    this.classes = [
      { class: GameEnvBackground, data: bgData },
      { class: Player, data: heroData },
      ...checkpoints.map((checkpoint) => ({ class: Npc, data: checkpoint })),
    ];
  }
}

export default TrainingHubMissionLevel;