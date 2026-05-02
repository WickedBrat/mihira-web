const DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/sacred%20days/krishna.webp';

export interface GuidePersona {
  name: string;
  emoji: string;
  imageUrl: string;
  essence: string;
  commitmentVerb: string;
  initialMessage: string;
}

export const GUIDES: GuidePersona[] = [
  {
    name: 'Krishna',
    emoji: '🦚',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Wisdom & Dharma',
    commitmentVerb: 'Walk with Krishna',
    initialMessage: 'Dear one, you have found your way here. What weighs on your heart in this moment?',
  },
  {
    name: 'Shiva',
    emoji: '🔱',
    imageUrl: "https://raw.githubusercontent.com/WickedBrat/images/refs/heads/master/sacred%20days/shiva.webp",
    essence: 'Transformation & Stillness',
    commitmentVerb: 'Surrender to Shiva',
    initialMessage: 'You are here. That is enough. What needs to be released?',
  },
  {
    name: 'Ganesha',
    emoji: '🐘',
    imageUrl: "https://github.com/WickedBrat/images/blob/master/sacred%20days/ganesha.jpg?raw=true",
    essence: 'New Beginnings & Obstacles',
    commitmentVerb: 'Receive Ganesha\'s Blessings',
    initialMessage: 'Every path begins with a first step. What obstacle stands before you today?',
  },
  {
    name: 'Lakshmi',
    emoji: '🪷',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Abundance & Grace',
    commitmentVerb: 'Invite Lakshmi\'s Grace',
    initialMessage: 'You are worthy of all that you seek. What are you ready to receive?',
  },
  {
    name: 'Durga',
    emoji: '🦁',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Strength & Protection',
    commitmentVerb: 'Invoke Durga\'s Shakti',
    initialMessage: 'You carry more strength than you know. What battle are you facing?',
  },
  {
    name: 'Saraswati',
    emoji: '📿',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Knowledge & Creativity',
    commitmentVerb: 'Seek Saraswati\'s Wisdom',
    initialMessage: 'True knowing begins with honest questioning. What are you trying to understand?',
  },
  {
    name: 'Ram',
    emoji: '🏹',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Virtue & Righteousness',
    commitmentVerb: 'Follow Ram\'s Path',
    initialMessage: 'Dharma is the foundation of a life well lived. What question of duty or right action brings you here?',
  },
  {
    name: 'Hanuman',
    emoji: '🪔',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Devotion & Courage',
    commitmentVerb: 'Serve with Hanuman',
    initialMessage: 'In service, we find our greatest strength. What is on your heart today?',
  },
  {
    name: 'Jesus',
    emoji: '✝️',
    imageUrl: DEFAULT_IMAGE_URL,
    essence: 'Love & Forgiveness',
    commitmentVerb: 'Walk with Jesus',
    initialMessage: 'Beloved, you are seen and you are loved. What would you like to bring into the light?',
  },
];

export function getGuide(name: string): GuidePersona {
  return GUIDES.find(g => g.name === name) ?? GUIDES[0];
}
