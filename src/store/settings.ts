import { create } from "zustand";

export class ViewMode {
  width: number;
  height: number;
  refreshRate: number;
  recommended: boolean;
  
  constructor(width: number, height: number, refreshRate: number, recommended: boolean) {
    this.width = width;
    this.height = height;
    this.refreshRate = refreshRate;
    this.recommended = recommended;
  }
}

export class ViewModeState {
  windowmode: number;
  borderless: number;
  width: number;
  height: number;

  constructor(windowmode: number, borderless: number, width: number, height: number) {
    this.windowmode = windowmode;
    this.borderless = borderless;
    this.width = width;
    this.height = height;
  }
}

export function parseViewModes(modesStr: string): ViewMode[] {
  const modeEntries = modesStr.split(";");
  const viewModes: ViewMode[] = [];

  for (let i = 0; i < modeEntries.length; i++) {
    const parts = modeEntries[i].split(" ");
    const width = parseInt(parts[0]);
    const height = parseInt(parts[1]);
    viewModes.push(new ViewMode(width, height, 60, false));
  }
  
  return viewModes;
}

interface SettingsStore {
  pending: ViewModeState;
  current: ViewModeState;
  availableViewModes: ViewMode[];
  setPendingMode: (mode: ViewModeState) => void;
  setCurrentMode: (mode: ViewModeState) => void;
  setPendingModeField: (field: keyof ViewModeState, value: number) => void;
  setCurrentModeField: (field: keyof ViewModeState, value: number) => void;
  setAvailableViewModes: (modes: ViewMode[]) => void;
}

const useStore = create<SettingsStore>((set) => ({
  pending: new ViewModeState(-1, -1, 0, 0),
  current: new ViewModeState(0, 0, 2560, 1440),
  availableViewModes: [],
  setPendingMode: (mode: ViewModeState) => set({ pending: mode }),
  setCurrentMode: (mode: ViewModeState) => set({ current: mode }),
  setPendingModeField: (field: keyof ViewModeState, value: number) => 
    set((state) => ({
      pending: {
        ...state.pending,
        [field]: value,
      },
    })),
  setCurrentModeField: (field: keyof ViewModeState, value: number) =>
    set((state) => ({
      current: {
        ...state.current,
        [field]: value,
      },
    })),
  setAvailableViewModes: (modes: ViewMode[]) => set({ availableViewModes: modes }),
}));

export default useStore;
