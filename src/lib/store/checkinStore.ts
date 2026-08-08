import { create } from 'zustand';
import type { EmotionSuggestion, CopingStrategy, CardData } from '@/lib/ai/state';

export type BodyType = 'male' | 'female';

export type ZoneId =
  | 'head' | 'throat' | 'chest' | 'stomach' | 'back'
  | 'shoulder_l' | 'shoulder_r'
  | 'upper_arm_l' | 'upper_arm_r'
  | 'elbow_l' | 'elbow_r'
  | 'forearm_l' | 'forearm_r'
  | 'hand_l' | 'hand_r'
  | 'hips'
  | 'thigh_l' | 'thigh_r'
  | 'hamstring_l' | 'hamstring_r'
  | 'knee_l' | 'knee_r'
  | 'calf_l' | 'calf_r'
  | 'foot_l' | 'foot_r';

export interface SensationEntry {
  type: string;
  intensity: number;
}

export interface ZoneData {
  sensations: SensationEntry[];
}

interface CheckinState {
  bodyType: BodyType | null;
  activeZone: ZoneId | null;
  activeZoneIsRear: boolean;
  hoveredZone: ZoneId | null;
  isZoomed: boolean;
  zoneData: Record<ZoneId, ZoneData>;
  isProcessing: boolean;
  context: string;

  // Results state
  threadId: string | null;
  suggestions: EmotionSuggestion[];
  validationMessage: string | null;
  selectedEmotion: string | null;
  copingStrategies: CopingStrategy[];
  communicationCard: CardData | null;
  dictionaryUpdate: any | null;
  remapCount: number;
  isCrisis: boolean;
  crisisMessage: string | null;
  savedCardIds: string[];
  markCardSaved: (cardId: string) => void;

  // Results actions
  setCheckinResult: (result: {
    suggestions: EmotionSuggestion[];
    validation: string;
    threadId: string;
  }) => void;
  setCrisisResult: (message: string) => void;
  setSelectedEmotion: (emotion: string) => void;
  setSelectionResult: (result: {
    copingStrategies: CopingStrategy[];
    communicationCard: CardData;
    dictionaryUpdate?: any | null;
  }) => void;
  setRemapResult: (result: {
    suggestions: EmotionSuggestion[];
    validation: string;
  }) => void;
  incrementRemapCount: () => void;

  selectZone: (zone: ZoneId, isRear?: boolean) => void;
  deselectZone: () => void;
  setHoveredZone: (zone: ZoneId | null) => void;
  addSensation: (zone: ZoneId, sensation: SensationEntry) => void;
  removeSensation: (zone: ZoneId, index: number) => void;
  clearZone: (zone: ZoneId) => void;
  setContext: (context: string) => void;
  setProcessing: (processing: boolean) => void;
  getZoneSensationCount: (zone: ZoneId) => number;
  getAverageIntensity: (zone: ZoneId) => number;
  setBodyType: (type: BodyType | null) => void;
  reset: () => void;
}

const ALL_ZONES: ZoneId[] = [
  'head', 'throat', 'shoulder_l', 'shoulder_r',
  'chest', 'stomach', 'back', 'hips',
  'upper_arm_l', 'upper_arm_r',
  'elbow_l', 'elbow_r', 'forearm_l', 'forearm_r',
  'hand_l', 'hand_r',
  'thigh_l', 'thigh_r', 'hamstring_l', 'hamstring_r',
  'knee_l', 'knee_r', 'calf_l', 'calf_r',
  'foot_l', 'foot_r',
];

const createEmptyZoneData = (): Record<ZoneId, ZoneData> => {
  return ALL_ZONES.reduce((acc, z) => {
    acc[z] = { sensations: [] };
    return acc;
  }, {} as Record<ZoneId, ZoneData>);
};

export const useCheckinStore = create<CheckinState>((set, get) => ({
  bodyType: null,
  activeZone: null,
  activeZoneIsRear: false,
  hoveredZone: null,
  isZoomed: false,
  zoneData: createEmptyZoneData(),
  isProcessing: false,
  context: '',
  threadId: null,
  suggestions: [],
  validationMessage: null,
  selectedEmotion: null,
  copingStrategies: [],
  communicationCard: null,
  dictionaryUpdate: null,
  remapCount: 0,
  isCrisis: false,
  crisisMessage: null,
  savedCardIds: [],

  setBodyType: (type) => set({ bodyType: type }),
  selectZone: (zone, isRear = false) => set({ activeZone: zone, activeZoneIsRear: isRear, isZoomed: true }),
  deselectZone: () => set({ activeZone: null, activeZoneIsRear: false, isZoomed: false }),
  setHoveredZone: (zone) => set({ hoveredZone: zone }),

  addSensation: (zone, sensation) =>
    set((state) => ({
      zoneData: {
        ...state.zoneData,
        [zone]: {
          sensations: [...state.zoneData[zone].sensations, sensation],
        },
      },
    })),

  removeSensation: (zone, index) =>
    set((state) => ({
      zoneData: {
        ...state.zoneData,
        [zone]: {
          sensations: state.zoneData[zone].sensations.filter((_, i) => i !== index),
        },
      },
    })),

  clearZone: (zone) =>
    set((state) => ({
      zoneData: {
        ...state.zoneData,
        [zone]: { sensations: [] },
      },
    })),

  setContext: (context) => set({ context }),
  setProcessing: (processing) => set({ isProcessing: processing }),

  setCheckinResult: (result) => set({
    suggestions: result.suggestions,
    validationMessage: result.validation,
    threadId: result.threadId,
    isCrisis: false,
    crisisMessage: null,
  }),

  setCrisisResult: (message) => set({
    isCrisis: true,
    crisisMessage: message,
    suggestions: [],
  }),

  setSelectedEmotion: (emotion) => set({ selectedEmotion: emotion }),

  setSelectionResult: (result) => set({
    copingStrategies: result.copingStrategies,
    communicationCard: result.communicationCard,
    dictionaryUpdate: result.dictionaryUpdate || null,
  }),

  setRemapResult: (result) => set({
    suggestions: result.suggestions,
    validationMessage: result.validation,
  }),

  incrementRemapCount: () => set((state) => ({ remapCount: state.remapCount + 1 })),

  markCardSaved: (cardId) => set((state) => ({
    savedCardIds: state.savedCardIds.includes(cardId)
      ? state.savedCardIds
      : [...state.savedCardIds, cardId],
  })),

  getZoneSensationCount: (zone) => get().zoneData[zone].sensations.length,

  getAverageIntensity: (zone) => {
    const sensations = get().zoneData[zone].sensations;
    if (sensations.length === 0) return 0;
    const sum = sensations.reduce((acc, s) => acc + s.intensity, 0);
    return Math.round(sum / sensations.length);
  },

  reset: () =>
    set({
      bodyType: null,
      activeZone: null,
      activeZoneIsRear: false,
      hoveredZone: null,
      isZoomed: false,
      zoneData: createEmptyZoneData(),
      isProcessing: false,
      context: '',
      threadId: null,
      suggestions: [],
      validationMessage: null,
      selectedEmotion: null,
      copingStrategies: [],
      communicationCard: null,
      dictionaryUpdate: null,
      remapCount: 0,
      isCrisis: false,
      crisisMessage: null,
      savedCardIds: [],
    }),
}));

export const ZONE_LABELS: Record<ZoneId, string> = {
  head: 'Head',
  throat: 'Throat',
  shoulder_l: 'Left Shoulder',
  shoulder_r: 'Right Shoulder',
  chest: 'Chest',
  stomach: 'Stomach',
  back: 'Back',
  hips: 'Hips & Glutes',
  upper_arm_l: 'Left Upper Arm',
  upper_arm_r: 'Right Upper Arm',
  elbow_l: 'Left Elbow',
  elbow_r: 'Right Elbow',
  forearm_l: 'Left Forearm',
  forearm_r: 'Right Forearm',
  hand_l: 'Left Hand',
  hand_r: 'Right Hand',
  thigh_l: 'Left Thigh',
  thigh_r: 'Right Thigh',
  hamstring_l: 'Left Hamstring',
  hamstring_r: 'Right Hamstring',
  knee_l: 'Left Knee',
  knee_r: 'Right Knee',
  calf_l: 'Left Lower Leg',
  calf_r: 'Right Lower Leg',
  foot_l: 'Left Foot',
  foot_r: 'Right Foot',
};
