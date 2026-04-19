import { getVillainStates } from './db';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Biological Dictionary for Interactive Tooltips ──────────
export const BIO_DICTIONARY = {
  'dopamine': 'The "motivation and reward" chemical. It makes you want to seek out things that feel good (like scrolling or eating sugar).',
  'adenosine': 'A chemical that builds up in your brain while you are awake, making you feel sleepy. Caffeine blocks it!',
  'cortisol': 'The main stress hormone. It helps you wake up in the morning, but too much at the wrong time causes anxiety and energy crashes.',
  'prefrontal cortex': 'The logical, decision-making part of your brain right behind your forehead. It acts as your willpower muscle.',
  'glymphatic': 'The brain\'s waste clearance system that mostly works while you sleep to flush out toxic buildup.',
  'amygdala': 'The emotional, survival center of your brain. It triggers fight-or-flight responses when you are stressed or tired.',
  'leptin': 'A hormone made by fat cells that tells your brain "I am full, stop eating."',
  'vagus nerve': 'A super-highway of nerves connecting your brain to your gut. It sends signals about hunger, stress, and mood.',
  'sensory cortex': 'The part of your brain that processes things you feel, see, or hear.',
  'downregulate': 'When your brain reduces the number of its own receptors because it is overstimulated. It is like turning down the volume on a loud radio.',
  'receptors': 'Tiny docking stations on your brain cells that catch chemicals like dopamine or caffeine.'
};

// ⚠️ Note: For testing, you can paste an OpenAI API key here. 
// For production, it is highly recommended to move this fetch request 
// into a Supabase Edge Function so your API key isn't exposed in the app code!
const OPENAI_API_KEY = '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'; 

// Human-readable habits for the AI Prompt
const HABIT_MAP = {
  scroller: 'Infinite social media scrolling and digital overstimulation',
  caffdemon: 'Excessive caffeine dependency and energy crashes',
  sleepthief: 'Sleep deprivation and late-night screen time',
  snackgoblin: 'Junk food, sugar addiction, and binge eating',
};

// A robust, highly-credible offline database to fall back on
const OFFLINE_KNOWLEDGE_BASE = {
  scroller: [
    { emoji: '🎰', title: 'The Slot Machine Effect', fact: 'Infinite scroll strips away natural "stopping cues". Your brain\'s dopamine system gets hijacked exactly like it does at a casino, waiting for the next random reward.', q: 'What mechanism makes scrolling addictive?', options: ['Fixed rewards', 'Variable ratio rewards', 'High frame rates'], correct: 1 },
    { emoji: '📱', title: 'Phantom Vibration', fact: 'Ever felt your phone buzz when it didn\'t? Your brain\'s sensory cortex becomes so hyper-vigilant for social rewards that it misinterprets random muscle twitches as notifications.', q: 'What causes phantom vibrations?', options: ['Hardware Glitch', 'Muscle Fatigue', 'Hyper-vigilance'], correct: 2 },
    { emoji: '📉', title: 'Dopamine Baseline Drop', fact: 'Constantly spiking your dopamine with short-form content causes your brain to downregulate its dopamine receptors. This lowers your baseline, making normal tasks feel incredibly boring.', q: 'What happens to your receptors when you overstimulate them?', options: ['They multiply', 'They downregulate', 'They stop working entirely'], correct: 1 },
    { emoji: '👀', title: 'Attention Span Atrophy', fact: 'Switching context every 15 seconds trains your brain to expect a reward at that exact interval. This physically weakens your prefrontal cortex\'s ability to sustain focus on long tasks.', q: 'How does rapid context switching affect the brain?', options: ['Strengthens memory', 'Weakens sustained focus', 'Increases gray matter'], correct: 1 },
    { emoji: '🔄', title: 'The Zeigarnik Effect', fact: 'The brain remembers uncompleted tasks better than completed ones. Infinite feeds exploit this by never letting you "finish", creating a low-grade anxiety loop.', q: 'What is the Zeigarnik Effect?', options: ['Remembering unfinished tasks', 'Forgetting names', 'Ignoring ads'], correct: 0 },
    { emoji: '💡', title: 'Blue Light Alertness', fact: 'Screens emit blue light that mimics daylight, actively blocking the release of melatonin. This tricks your brain into thinking it is noon even at 2 AM.', q: 'What hormone does blue light block?', options: ['Dopamine', 'Cortisol', 'Melatonin'], correct: 2 },
  ],
  caffdemon: [
    { emoji: '☕', title: 'The Energy Loan', fact: 'Caffeine doesn\'t actually give you energy. It binds to your adenosine receptors, blocking the chemical that tells you you\'re tired. You\'re just borrowing energy from tomorrow.', q: 'What does caffeine actually do?', options: ['Creates Energy', 'Blocks Tiredness', 'Burns Fat'], correct: 1 },
    { emoji: '🎢', title: 'The Cortisol Crash', fact: 'Drinking coffee within 90 minutes of waking interferes with your natural cortisol awakening response. This is why you experience a massive mid-afternoon crash.', q: 'How long should you wait after waking to drink coffee?', options: ['Immediately', '30 minutes', '90 minutes'], correct: 2 },
    { emoji: '⏳', title: 'The 6-Hour Half-Life', fact: 'Caffeine has a quarter-life of 12 hours. If you drink a coffee at 2 PM, 25% of that caffeine is still actively blocking your sleep receptors at 2 AM.', q: 'How much caffeine is left 12 hours later?', options: ['0%', '25%', '50%'], correct: 1 },
    { emoji: '❤️', title: 'Adrenaline Spike', fact: 'Caffeine triggers your adrenal glands to release epinephrine (adrenaline). Your body literally reacts as if it is in a fight-or-flight survival situation.', q: 'What hormone is triggered by caffeine to simulate fight-or-flight?', options: ['Serotonin', 'Melatonin', 'Adrenaline'], correct: 2 },
    { emoji: '🚰', title: 'Dehydration Fatigue', fact: 'Caffeine is a mild diuretic. Mild dehydration physically thickens your blood, making your heart work harder to pump oxygen to your brain, resulting in brain fog.', q: 'How does caffeine-induced dehydration cause brain fog?', options: ['It thickens the blood', 'It cools the brain', 'It slows breathing'], correct: 0 },
  ],
  sleepthief: [
    { emoji: '💤', title: 'The Prefrontal Shrink', fact: 'Sleep deprivation temporarily impairs your prefrontal cortex—the part of your brain responsible for willpower and decision-making. Everything feels harder when you\'re tired because biologically, it is.', q: 'Which part of the brain handles willpower?', options: ['Prefrontal Cortex', 'Sensory Cortex', 'Brain Stem'], correct: 0 },
    { emoji: '🧹', title: 'The Glymphatic Wash', fact: 'During deep sleep, your brain\'s glymphatic system flushes out toxic amyloid-beta proteins built up during the day. Skipping sleep leaves these toxins to damage neural pathways.', q: 'What system flushes brain toxins during sleep?', options: ['Lymphatic', 'Endocrine', 'Glymphatic'], correct: 2 },
    { emoji: '🔥', title: 'Amygdala Hyper-Reactivity', fact: 'Without enough sleep, the emotional center of your brain (the amygdala) becomes up to 60% more reactive. This makes minor annoyances feel like major threats.', q: 'How much more reactive does the amygdala become?', options: ['20%', '40%', '60%'], correct: 2 },
    { emoji: '🍔', title: 'The Hunger Hormone', fact: 'Losing sleep causes ghrelin (the hunger hormone) to spike and leptin (the fullness hormone) to plummet. Your brain chemically forces you to crave junk food to replace the missing energy.', q: 'Which hormone spikes when you lack sleep?', options: ['Insulin', 'Ghrelin', 'Testosterone'], correct: 1 },
    { emoji: '💾', title: 'Memory Consolidation', fact: 'During REM sleep, your hippocampus transfers short-term memories into the neocortex for long-term storage. Miss REM sleep, and you literally lose the things you learned that day.', q: 'When do short-term memories become long-term?', options: ['During deep focus', 'During REM sleep', 'While eating'], correct: 1 },
  ],
  snackgoblin: [
    { emoji: '🍭', title: 'Biological Override', fact: 'High-sugar foods light up the brain\'s reward center so intensely that it overrides your natural fullness signals (Leptin). It\'s a biological override, not weak willpower.', q: 'Which hormone signals that you are full?', options: ['Ghrelin', 'Cortisol', 'Leptin'], correct: 2 },
    { emoji: '🦠', title: 'The Microbiome Axis', fact: 'The bacteria in your gut literally send signals up your vagus nerve to your brain, demanding the foods they survive on. If you eat sugar, you breed bacteria that crave sugar.', q: 'How do gut bacteria communicate with the brain?', options: ['Spinal Cord', 'Vagus Nerve', 'Bloodstream'], correct: 1 },
    { emoji: '📉', title: 'Sugar Downregulation', fact: 'Like hard drugs, frequent sugar spikes cause the brain to reduce its dopamine receptors. You eventually need more sugar just to feel the same level of basic pleasure.', q: 'Why do sugar cravings increase over time?', options: ['Reduced dopamine receptors', 'Increased stomach size', 'Lower blood pressure'], correct: 0 },
    { emoji: '🎢', title: 'The Insulin Rollercoaster', fact: 'When you eat simple carbs, your pancreas dumps insulin to clear the glucose. This causes a rapid blood sugar crash, making your brain panic and demand more sugar immediately.', q: 'What causes the sugar crash?', options: ['Insulin clearing glucose', 'Lack of water', 'Caffeine withdrawal'], correct: 0 },
  ]
};

export async function getCuratedIntel(userId, count = 5) {
  try {
    // 1. Identify what the user is struggling with right now
    const { data: states } = await getVillainStates(userId);
    const activeIds = states ? states.map(s => s.villain_id) : [];
    
    // 2. Load the 7-day memory of seen facts from local storage
    const memoryKey = `neuro_memory_${userId}`;
    const memoryStr = await AsyncStorage.getItem(memoryKey);
    let memory = memoryStr ? JSON.parse(memoryStr) : { seenTitles: [], lastCleared: Date.now() };

    // Wipe memory if it is older than 7 days (604,800,000 milliseconds)
    if (Date.now() - memory.lastCleared > 604800000) {
      memory = { seenTitles: [], lastCleared: Date.now() };
    }

    // 3. Try to generate highly-credible dynamic content using AI
    if (OPENAI_API_KEY) {
      const topics = activeIds.length > 0 
        ? activeIds.map(id => HABIT_MAP[id] || id).join(', ')
        : 'General procrastination, bad habits, and lack of focus';

      const systemPrompt = `You are a neuroscientist like Andrew Huberman. Generate ${count} highly credible, scientifically accurate facts about how the following habits affect the brain: ${topics}.
      Ensure the facts are completely new. DO NOT repeat or closely resemble these recently shown topics: ${memory.seenTitles.slice(-20).join(', ')}.
      Format as a raw JSON array of objects with exactly these keys:
      [
        {
          "emoji": "🧠",
          "title": "Short Punchy Title",
          "fact": "Fascinating biological mechanism explaining why this habit is hard to break. Be scientific but accessible.",
          "q": "A multiple choice question testing their understanding of the fact.",
          "options": ["Wrong option", "Right option", "Wrong option"],
          "correct": 1
        }
      ]
      Do not include markdown formatting like \`\`\`json. Return ONLY the raw JSON array.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: systemPrompt }],
          temperature: 0.7,
        })
      });

      if (response.ok) {
        const jsonRes = await response.json();
        const aiFacts = JSON.parse(jsonRes.choices[0].message.content);
        
        // Save what they just saw to the 7-day memory
        memory.seenTitles = [...new Set([...memory.seenTitles, ...aiFacts.map(f => f.title)])];
        await AsyncStorage.setItem(memoryKey, JSON.stringify(memory));
        
        return aiFacts;
      }
    }

    // 4. Fallback: If no API key or offline, build a curated mix from the local database
    let curatedList = [];
    if (activeIds.length > 0) {
      activeIds.forEach(id => {
        if (OFFLINE_KNOWLEDGE_BASE[id]) {
          curatedList = [...curatedList, ...OFFLINE_KNOWLEDGE_BASE[id]];
        }
      });
    } else {
      // Give them a generic mix if no villains are active
      curatedList = [...OFFLINE_KNOWLEDGE_BASE.scroller, ...OFFLINE_KNOWLEDGE_BASE.caffdemon];
    }
    
    // Filter out facts the user has already seen this week
    let filteredList = curatedList.filter(item => !memory.seenTitles.includes(item.title));

    // If filtering leaves us with almost nothing, reset the memory to prevent crashing
    if (filteredList.length < count) {
      filteredList = curatedList;
    }

    // Shuffle and slice to the requested count
    const finalList = filteredList.sort(() => 0.5 - Math.random()).slice(0, count);
    
    // Save what they just saw to the 7-day memory
    memory.seenTitles = [...new Set([...memory.seenTitles, ...finalList.map(f => f.title)])];
    await AsyncStorage.setItem(memoryKey, JSON.stringify(memory));

    return finalList;

  } catch (error) {
    console.warn("Failed to generate AI intel, returning default offline data.", error);
    return OFFLINE_KNOWLEDGE_BASE.scroller.slice(0, count);
  }
}