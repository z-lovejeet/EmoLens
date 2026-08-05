import { create } from 'zustand';

export type Gender = 'male' | 'female';

export type ZoneId =
  | 'head' | 'throat' | 'chest' | 'stomach' | 'back'
  | 'shoulder_l' | 'shoulder_r'
  | 'arm_l' | 'arm_r' | 'hand_l' | 'hand_r'
  | 'hips'
  | 'leg_l' | 'leg_r' | 'foot_l' | 'foot_r';

export interface SensationEntry {
  type: string;
  intensity: number;
}

export interface ZoneData {
  sensations: SensationEntry[];
}

interface CheckinState {
  // Gender selection
  gender: Gender | null;
  setGender: (g: Gender) => void;

  activeZone: ZoneId | null;
  hoveredZone: ZoneId | null;
  isZoomed: boolean;
  zoneData: Record<ZoneId, ZoneData>;
  isProcessing: boolean;
  context: string;

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

const ALL_ZONES: ZoneId[] = [
  'head', 'throat', 'shoulder_l', 'shoulder_r',
  'chest', 'stomach', 'back', 'hips',
  'arm_l', 'arm_r', 'hand_l', 'hand_r',
  'leg_l', 'leg_r', 'foot_l', 'foot_r',
];

const createEmptyZoneData = (): Record<ZoneId, ZoneData> => {
  return ALL_ZONES.reduce((acc, z) => {
    acc[z] = { sensations: [] };
    return acc;
  }, {} as Record<ZoneId, ZoneData>);
};

export const useCheckinStore = create<CheckinState>((set, get) => ({
  gender: null,
  setGender: (g) => set({ gender: g }),

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
      gender: null,
      activeZone: null,
      hoveredZone: null,
      isZoomed: false,
      zoneData: createEmptyZoneData(),
      isProcessing: false,
      context: '',
    }),
}));

export const ZONE_LABELS: Record<ZoneId, string> = {
  head: 'Head',
  throat: 'Throat',
  shoulder_l: 'Left Shoulder',
  shoulder_r: 'Right Shoulder',
  chest: 'Chest',
  stomach: 'Stomach',
  back: 'Upper Back',
  hips: 'Hips & Glutes',
  arm_l: 'Left Arm',
  arm_r: 'Right Arm',
  hand_l: 'Left Hand',
  hand_r: 'Right Hand',
  leg_l: 'Left Leg',
  leg_r: 'Right Leg',
  foot_l: 'Left Foot',
  foot_r: 'Right Foot',
};
