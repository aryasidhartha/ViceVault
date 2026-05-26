export const VILLAINS = [
  {
    id: 'scroller',
    emoji: '📱',
    name: 'The Scroller',
    type: 'Doomscrolling / Screen addiction',
    defaultHP: 80,
    taunts: [
      "Didn't see you yesterday. I'll take that as a win.",
      "Two days gone. I've redecorated. Hope you don't mind.",
      "You came back. Cute. I've been busy without you.",
      "Miss me? You did. We both know it.",
    ],
    winResponse: "You put it down. That's the whole thing.",
    science: "When you doomscroll, your brain releases small hits of dopamine with each new post — keeping you searching for the next one. It's the same loop as a slot machine. No jackpot is coming. Just the pull.",
    tip: "Tomorrow morning, put your phone in another room before you sleep. Distance is the cheat code — willpower doesn't work when it's arm's reach away.",
    hero: {
      emoji: '🧘',
      name: 'The Present',
      desc: "Exists in the room he's actually in.",
      unlockPower: 80,
      unlockReward: "Deep Focus Mode — 2x XP challenges unlocked",
    },
  },
  {
    id: 'phantom',
    emoji: '👁️',
    name: 'The Phantom',
    type: 'Porn addiction',
    defaultHP: 75,
    taunts: [
      "Two days in a row. I'm basically living here.",
      "Still here. You know where to find me.",
      "You're stronger than you think. I just need you to forget that.",
      "I don't judge. That's kind of the problem.",
    ],
    winResponse: "Chose real life. That's harder than it sounds.",
    science: "Porn triggers supernormal stimulation — it's more intense than anything real life delivers, which gradually recalibrates your brain's reward threshold. Real connection starts to feel underwhelming by comparison.",
    tip: "Block it at the router level — not just the app. When your brain is in that state, your willpower is already gone. Make the path technically harder.",
    hero: {
      emoji: '🤝',
      name: 'The Real',
      desc: 'Finds connection in actual humans.',
      unlockPower: 80,
      unlockReward: 'Connection Challenge — weekly real-world prompts',
    },
  },
  {
    id: 'sleepthief',
    emoji: '🌙',
    name: 'The Sleep Thief',
    type: 'Sleep deprivation',
    defaultHP: 70,
    taunts: [
      "4am again. We're practically roommates.",
      "You said 11pm. It's 1:30am. Just saying.",
      "How's that tired feeling working out for you?",
      "I don't take. You give. Every night.",
    ],
    winResponse: "Lights out on time. The Rested is watching.",
    science: "Sleep-deprived brains show 40% reduced prefrontal cortex activity — the part that handles impulse control and decision-making. Every bad choice tomorrow is partly tonight's fault.",
    tip: "Set a 'screens off' alarm for 30 minutes before you want to sleep. Not when you want to sleep — 30 minutes before. That's the actual target.",
    hero: {
      emoji: '☀️',
      name: 'The Rested',
      desc: 'Wakes up before his alarm. Disgusting.',
      unlockPower: 80,
      unlockReward: 'Morning Protocol — personalized AM routine challenge',
    },
  },
  {
    id: 'snackgoblin',
    emoji: '🍔',
    name: 'The Snack Goblin',
    type: 'Junk food / Ultra-processed',
    defaultHP: 65,
    taunts: [
      "You opened the cupboard. That counts.",
      "It was just one. Then it wasn't.",
      "I live in your kitchen. Rent free.",
      "Boredom tastes like chips. You know this.",
    ],
    winResponse: "Didn't eat garbage. The Nourished notices.",
    science: "Ultra-processed foods are engineered to bypass satiety signals — they hit salt-fat-sugar combinations that your brain never evolved to moderate. It's not weakness, it's a formula.",
    tip: "Eat a piece of fruit or drink a glass of water first. Not instead of — before. Half the time, the craving dissolves. The other half, you at least didn't go in empty.",
    hero: {
      emoji: '🥦',
      name: 'The Nourished',
      desc: 'Eats food that had a mother or a root.',
      unlockPower: 80,
      unlockReward: 'Fuel Mode — nutrition challenge cards',
    },
  },
  {
    id: 'caffdemon',
    emoji: '☕',
    name: 'The Caffeine Demon',
    type: 'Caffeine dependency',
    defaultHP: 60,
    taunts: [
      "You needed me just to start the meeting.",
      "Third cup. Not that anyone's counting.",
      "Can you even remember a morning without me?",
      "I'm not a habit. I'm a requirement. Your words.",
    ],
    winResponse: "Made it through on your own. Quietly impressive.",
    science: "Caffeine works by blocking adenosine receptors — the molecule that builds up sleepiness. It doesn't remove fatigue, it hides it. When the caffeine wears off, the full debt lands.",
    tip: "Push your first coffee 90 minutes after waking. Let cortisol peak naturally first. You'll feel it less — and that's the point.",
    hero: {
      emoji: '⚡',
      name: 'The Grounded',
      desc: 'Naturally alert. Annoyingly so.',
      unlockPower: 80,
      unlockReward: 'Energy Audit — track natural energy peaks',
    },
  },
  {
    id: 'comparotron',
    emoji: '📊',
    name: 'The Compare-O-Tron',
    type: 'Social comparison / FOMO',
    defaultHP: 85,
    taunts: [
      "You checked their page again. I felt it.",
      "Their life looks better from your angle. Funny how that works.",
      "The highlight reel is always running. You just keep watching.",
      "How's your life looking compared to theirs? Don't answer that.",
    ],
    winResponse: "Kept your eyes on your own life. That's rare.",
    science: "Social comparison activates the same neural threat response as physical danger. Your brain processes being ranked below others as a survival risk — hence the chest-tightening feeling. It's ancient wiring, terrible for the modern internet.",
    tip: "Mute three accounts that consistently make you feel behind. Not unfollow — mute. No confrontation, no drama. Just stop feeding the loop.",
    hero: {
      emoji: '🌿',
      name: 'The Enough',
      desc: 'Stopped checking. Started living.',
      unlockPower: 80,
      unlockReward: 'Abundance Mode — gratitude + presence challenges',
    },
  },
  {
    id: 'vapeghost',
    emoji: '💨',
    name: 'The Vape Ghost',
    type: 'Nicotine / Vaping addiction',
    defaultHP: 75,
    taunts: [
      "Just one hit. It'll take the edge off.",
      "I'm right here in your pocket.",
      "You're stressed. You need me.",
      "It's just flavored air... right?",
    ],
    winResponse: "Breathed real air today. The Lungs are grateful.",
    science: "Nicotine reaches the brain in 10 seconds, causing a massive artificial dopamine spike. Your brain quickly downregulates natural dopamine production, making you dependent on the vape just to feel 'normal'.",
    tip: "Increase friction. Put the vape in a difficult-to-reach place, like a timed lockbox or the trunk of your car.",
    hero: {
      emoji: '🫁',
      name: 'The Breath',
      desc: 'Finds calm without the cloud.',
      unlockPower: 80,
      unlockReward: 'Deep Breathing Protocol',
    },
  },
  {
    id: 'couchpotato',
    emoji: '🛋️',
    name: 'The Couch Potato',
    type: 'Sedentary lifestyle / Skipping workouts',
    defaultHP: 70,
    taunts: [
      "We can just go tomorrow. Tomorrow is better.",
      "You've worked hard today, you deserve to sit.",
      "Why lift heavy circles when the couch is so soft?",
      "Just one more episode before we move.",
    ],
    winResponse: "Got up and moved. The Momentum builds.",
    science: "Prolonged sitting reduces blood flow to the brain and decreases the production of BDNF (Brain-Derived Neurotrophic Factor), which is like miracle-gro for your neurons.",
    tip: "Commit to just 5 minutes. Put on your workout clothes and do 5 minutes of anything. Often, starting is the only hard part.",
    hero: {
      emoji: '🏃',
      name: 'The Momentum',
      desc: 'An object in motion stays in motion.',
      unlockPower: 80,
      unlockReward: 'Endorphin Rush Mode',
    },
  },
  {
    id: 'hustledemon',
    emoji: '💼',
    name: 'The Hustle Demon',
    type: 'Overworking / Burnout',
    defaultHP: 80,
    taunts: [
      "If you're not grinding, you're falling behind.",
      "Sleep is for the weak.",
      "You can rest when you're dead.",
      "Look at them, working harder than you.",
    ],
    winResponse: "Clocked out and shut down. The Balanced knows rest is productive.",
    science: "Chronic overworking floods the brain with cortisol, leading to an enlarged amygdala and a weakened prefrontal cortex. You literally become more anxious and less capable of complex problem-solving.",
    tip: "Schedule your rest with the same intensity as your work. Set a hard 'tools down' alarm for the evening.",
    hero: {
      emoji: '⚖️',
      name: 'The Balanced',
      desc: 'Knows that resting is a requirement, not a reward.',
      unlockPower: 80,
      unlockReward: 'Disconnect Challenge',
    },
  },
];

// --- Custom Villain Support ---
let customVillains = [];

export function registerCustomVillains(villains) {
  customVillains = villains;
}

export function getAllVillains() {
  return [...VILLAINS, ...customVillains];
}

export function getVillainById(id) {
  return VILLAINS.find(v => v.id === id) || customVillains.find(v => v.id === id);
}

export function getHeroForVillain(villainId) {
  const villain = getVillainById(villainId);
  return villain?.hero || null;
}
