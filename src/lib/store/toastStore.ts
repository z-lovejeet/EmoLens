import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
  visible: boolean;
  show: (message: string, type?: ToastType) => void;
  dismiss: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  id: 0,
  message: '',
  type: 'info',
  visible: false,
  show: (message, type = 'info') =>
    set((state) => ({ id: state.id + 1, message, type, visible: true })),
  dismiss: () => set({ visible: false }),
}));
