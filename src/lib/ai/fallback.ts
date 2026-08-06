import type { EmotionSuggestion, CopingStrategy, CardData } from './state';

// Static fallback emotion suggestions keyed by primary body zone
const FALLBACK_EMOTIONS: Record<string, EmotionSuggestion[]> = {
  chest: [
    {
      emotion: 'Anxiety',
      confidence: 0.75,
      category: 'Nervous System Response',
      explanation: 'Anxiety is an emotional and physical alert state that occurs when your mind anticipates danger, deadlines, or uncertainty.',
      possibleCauses: [
        'Upcoming tests, presentations, or social interactions',
        'Feeling unprepared or uncertain about what comes next',
        'High expectations or fear of making mistakes'
      ],
      bodyConnection: 'The tightness or racing feeling in your chest is your nervous system activating its natural alert mode.',
    },
    {
      emotion: 'Overstimulation',
      confidence: 0.65,
      category: 'Sensory Processing',
      explanation: 'Overstimulation happens when your brain is overloaded by environmental inputs like sound, light, or rapid activity.',
      possibleCauses: [
        'Loud environments such as crowded cafeterias or hallways',
        'Prolonged screen time or bright lighting',
        'Juggling multiple tasks or conversations simultaneously'
      ],
      bodyConnection: 'Your chest tightness and body tension indicate your sensory system needs a calm reset.',
    },
    {
      emotion: 'Excitement',
      confidence: 0.40,
      category: 'Positive Activation',
      explanation: 'Excitement is a high-energy positive emotion that prepares your body for an upcoming event or activity you enjoy.',
      possibleCauses: [
        'Looking forward to a fun event or activity',
        'Receiving good news or starting a project you care about',
        'Reconnecting with a close friend'
      ],
      bodyConnection: 'Fluttering or racing in your chest can be your body mobilizing positive energy.',
    },
  ],
  stomach: [
    {
      emotion: 'Apprehension',
      confidence: 0.70,
      category: 'Emotional Regulation',
      explanation: 'Apprehension is a cautious feeling when entering unfamiliar situations or facing unexpected changes.',
      possibleCauses: [
        'Entering a new classroom or meeting new people',
        'Sudden changes to your daily schedule',
        'Waiting for important feedback or news'
      ],
      bodyConnection: 'Sensations in your stomach reflect the close link between your brain and digestion when facing uncertainty.',
    },
    {
      emotion: 'Stress',
      confidence: 0.60,
      category: 'Nervous System Response',
      explanation: 'Stress builds up when the demands placed on you exceed your current energy or time capacity.',
      possibleCauses: [
        'Multiple assignments or deadlines piling up',
        'Unresolved conflict or miscommunication',
        'Not getting enough restorative sleep'
      ],
      bodyConnection: 'Stomach tightness or churning often signals that your body is carrying unreleased stress.',
    },
  ],
  head: [
    {
      emotion: 'Cognitive Fatigue',
      confidence: 0.70,
      category: 'Mental Energy',
      explanation: 'Cognitive fatigue occurs after intense periods of concentration, problem-solving, or emotional masking.',
      possibleCauses: [
        'Long study sessions or hours of sustained focus',
        'Constantly trying to fit in or mask your true feelings',
        'Lack of mental breaks during the school day'
      ],
      bodyConnection: 'A heavy or foggy sensation in your head means your brain needs downtime to process and recharge.',
    },
    {
      emotion: 'Physical Exhaustion',
      confidence: 0.65,
      category: 'Physical Well-being',
      explanation: 'Physical exhaustion is deep whole-body tiredness resulting from lack of sleep, illness, or physical exertion.',
      possibleCauses: [
        'Poor or interrupted sleep quality',
        'Dehydration or missed meals',
        'Physical overexertion'
      ],
      bodyConnection: 'Heaviness in your head and body is a direct signal to prioritize sleep and nutrition.',
    },
  ],
  throat: [
    {
      emotion: 'Unexpressed Feelings',
      confidence: 0.70,
      category: 'Communication',
      explanation: 'This occurs when you hold back thoughts, boundaries, or emotions that you feel unsafe or unable to speak aloud.',
      possibleCauses: [
        'Wanting to say "no" but feeling pressured to agree',
        'Feeling misunderstood by peers or adults',
        'Swallowing frustration or sadness to avoid conflict'
      ],
      bodyConnection: 'Tightness or a lump in your throat is a classic sign of holding back your vocal expression.',
    },
  ],
};

// Default fallback for zones without specific mappings
const DEFAULT_FALLBACK: EmotionSuggestion[] = [
  {
    emotion: 'Body Tension',
    confidence: 0.50,
    category: 'Physical Well-being',
    explanation: 'Body tension is held physical stress stored in muscles due to posture, stress, or sensory load.',
    possibleCauses: [
      'Sitting in one position for a long time',
      'Unconscious muscle bracing from stress',
      'Sensory input that feels ungrounding'
    ],
    bodyConnection: 'The physical signals you logged indicate your body is holding onto physical tension.',
  },
];

/**
 * Returns static fallback emotion suggestions based on the primary body zone.
 */
export function getStaticFallbackSuggestions(parsedInput: string): EmotionSuggestion[] {
  const input = parsedInput.toLowerCase();
  for (const [zone, suggestions] of Object.entries(FALLBACK_EMOTIONS)) {
    if (input.includes(zone)) {
      return suggestions;
    }
  }
  return DEFAULT_FALLBACK;
}

// Static fallback coping strategies
const FALLBACK_COPING: Record<string, CopingStrategy[]> = {
  anxiety: [
    {
      name: 'Box Breathing',
      icon: 'wind',
      category: 'breathing',
      shortDescription: 'A simple breathing pattern that calms your nervous system.',
      fullInstructions: 'Step 1: Breathe in through your nose for 4 counts. Step 2: Hold your breath for 4 counts. Step 3: Breathe out through your mouth for 4 counts. Step 4: Hold for 4 counts. Repeat 3-4 times.',
      matchReason: 'Deep breathing directly counters the fight-or-flight response that causes anxiety.',
    },
    {
      name: '5-4-3-2-1 Grounding',
      icon: 'hand',
      category: 'grounding',
      shortDescription: 'Use your senses to anchor yourself in the present moment.',
      fullInstructions: 'Step 1: Name 5 things you can SEE. Step 2: Name 4 things you can TOUCH. Step 3: Name 3 things you can HEAR. Step 4: Name 2 things you can SMELL. Step 5: Name 1 thing you can TASTE.',
      matchReason: 'Grounding pulls your attention away from anxious thoughts and back to your body.',
    },
    {
      name: 'Cold Water Reset',
      icon: 'droplets',
      category: 'sensory',
      shortDescription: 'Splash cold water on your wrists to reset your nervous system.',
      fullInstructions: 'Step 1: Go to a sink. Step 2: Run cold water over the insides of your wrists for 30 seconds. Step 3: Splash cold water on the back of your neck. Step 4: Take 3 slow breaths.',
      matchReason: 'Cold water activates your dive reflex, which slows your heart rate naturally.',
    },
  ],
  sadness: [
    {
      name: 'Comfort Position',
      icon: 'armchair',
      category: 'sensory',
      shortDescription: 'Find a comfortable, safe position to let yourself feel.',
      fullInstructions: 'Step 1: Find a quiet, comfortable spot. Step 2: Wrap yourself in a blanket or hug a pillow. Step 3: Let your body relax into the support. Step 4: Stay for at least 5 minutes.',
      matchReason: 'Physical comfort helps your body feel safe enough to process sadness.',
    },
    {
      name: 'Gentle Movement',
      icon: 'footprints',
      category: 'movement',
      shortDescription: 'A slow walk or gentle stretching to release held sadness.',
      fullInstructions: 'Step 1: Stand up slowly. Step 2: Roll your shoulders 5 times forward, then 5 times back. Step 3: Take a slow 5-minute walk, focusing on how your feet feel with each step. Step 4: Stretch your arms above your head and hold for 10 seconds.',
      matchReason: 'Gentle movement helps release the heaviness that sadness creates in your body.',
    },
    {
      name: 'Mindful Breathing',
      icon: 'cloud',
      category: 'breathing',
      shortDescription: 'Slow breathing to create space for your feelings.',
      fullInstructions: 'Step 1: Place one hand on your chest. Step 2: Breathe in slowly for 5 counts. Step 3: Breathe out for 7 counts. Step 4: Focus on the rise and fall under your hand. Repeat 5 times.',
      matchReason: 'Extended exhales activate your calming nervous system and ease the weight of sadness.',
    },
  ],
};

const DEFAULT_COPING: CopingStrategy[] = [
  {
    name: 'Body Scan',
    icon: 'scan',
    category: 'grounding',
    shortDescription: 'Notice and release tension throughout your body.',
    fullInstructions: 'Step 1: Close your eyes or soften your gaze. Step 2: Start at the top of your head. Step 3: Slowly move your attention down through each body part. Step 4: When you find tension, breathe into that spot. Step 5: Let the tension go as you breathe out. Continue down to your toes.',
    matchReason: 'A body scan helps you understand what your body is telling you and release stored tension.',
  },
  {
    name: 'Press and Release',
    icon: 'grip-horizontal',
    category: 'movement',
    shortDescription: 'Tense and release your muscles to discharge physical stress.',
    fullInstructions: 'Step 1: Make tight fists with both hands. Step 2: Hold for 5 seconds. Step 3: Release and shake out your hands. Step 4: Tense your shoulders up to your ears. Step 5: Hold for 5 seconds. Step 6: Drop them down. Repeat for any tense body part.',
    matchReason: 'Progressive muscle relaxation helps release physical tension your body is holding.',
  },
  {
    name: 'Square Breathing',
    icon: 'square',
    category: 'breathing',
    shortDescription: 'A simple breathing square to regulate your nervous system.',
    fullInstructions: 'Step 1: Breathe in for 4 counts. Step 2: Hold for 4 counts. Step 3: Breathe out for 4 counts. Step 4: Hold for 4 counts. Repeat 4 times.',
    matchReason: 'Rhythmic breathing helps your nervous system shift from stress mode to calm mode.',
  },
];

/**
 * Returns static coping strategies when LLM fails.
 */
export function getStaticCopingStrategies(emotion: string): CopingStrategy[] {
  const key = emotion.toLowerCase();
  return FALLBACK_COPING[key] ?? DEFAULT_COPING;
}

/**
 * Builds a static communication card when LLM fails.
 */
export function buildStaticCard(
  emotion: string,
  sensoryPreferences: string[]
): CardData {
  const defaultHelps = [
    'Give me a few minutes of quiet space',
    'Please do not ask too many questions right now',
    'Let me take a break if I need one',
  ];

  if (sensoryPreferences.includes('movement')) {
    defaultHelps.push('Let me go for a walk if I want to');
  }
  if (sensoryPreferences.includes('quiet')) {
    defaultHelps.push('Please speak softly');
  }

  return {
    id: crypto.randomUUID(),
    emotion,
    intensityLevel: 'moderate',
    whatHelpsMe: defaultHelps.slice(0, 5),
    validationMessage: `I am experiencing ${emotion} right now. This is temporary and I am working through it.`,
    generatedAt: new Date().toISOString(),
  };
}
