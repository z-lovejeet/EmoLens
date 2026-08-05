import { create } from 'zustand';

export type ZoneId =
  | 'head' | 'throat' | 'chest' | 'stomach' | 'back'
  | 'arm_l' | 'arm_r' | 'hand_l' | 'hand_r'
  | 'leg_l' | 'leg_r' | 'foot_l' | 'foot_r';

export interface SensationEntry {
  type: string;
  intensity: number;
}

export interface ZoneData {
  sensations: SensationEntry[];
}

interface CheckinState {
  // Zone interaction
  activeZone: ZoneId | null;
  hoveredZone: ZoneId | null;
  isZoomed: boolean;
  zoneData: Record<ZoneId, ZoneData>;

  // AI processing
  isProcessing: boolean;
  context: string;

  // Actions
  selectZone: (zone: ZoneId) => void;
  deselectZone: () => void;
  setHoveredZone: (zone: ZoneId | null) => void;
  addSensation: (zone: ZoneId, sensation: SensationEntry) => void;
  removeSensation: (zone: ZoneId, index: number) => void;
  clearZone: (zone: ZoneId) => void;
  setContext: (context: string) => void;
  setProcessing: (processing: boolean) => void;
  getZoneSensationCount: (zone: ZoneId) => number;
  getAverageIntensity: (zone: ZoneId) => number;
  reset: () => void;
}

const createEmptyZoneData = (): Record<ZoneId, ZoneData> => {
  const zones: ZoneId[] = [
    'head', 'throat', 'chest', 'stomach', 'back',
    'arm_l', 'arm_r', 'hand_l', 'hand_r',
    'leg_l', 'leg_r', 'foot_l', 'foot_r',
  ];
  return zones.reduce((acc, z) => {
    acc[z] = { sensations: [] };
    return acc;
  }, {} as Record<ZoneId, ZoneData>);
};

export const useCheckinStore = create<CheckinState>((set, get) => ({
  activeZone: null,
  hoveredZone: null,
  isZoomed: false,
  zoneData: createEmptyZoneData(),
  isProcessing: false,
  context: '',

  selectZone: (zone) => set({ activeZone: zone, isZoomed: true }),
  deselectZone: () => set({ activeZone: null, isZoomed: false }),
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

  getZoneSensationCount: (zone) => get().zoneData[zone].sensations.length,

  getAverageIntensity: (zone) => {
    const sensations = get().zoneData[zone].sensations;
    if (sensations.length === 0) return 0;
    const sum = sensations.reduce((acc, s) => acc + s.intensity, 0);
    return Math.round(sum / sensations.length);
  },

  reset: () =>
    set({
      activeZone: null,
      hoveredZone: null,
      isZoomed: false,
      zoneData: createEmptyZoneData(),
      isProcessing: false,
      context: '',
    }),
}));

// Zone display names
export const ZONE_LABELS: Record<ZoneId, string> = {
  head: 'Head',
  throat: 'Throat',
  chest: 'Chest',
  stomach: 'Stomach',
  back: 'Back',
  arm_l: 'Left Arm',
  arm_r: 'Right Arm',
  hand_l: 'Left Hand',
  hand_r: 'Right Hand',
  leg_l: 'Left Leg',
  leg_r: 'Right Leg',
  foot_l: 'Left Foot',
  foot_r: 'Right Foot',
};
