import { create } from "zustand";

const useStore = create((set, get) => ({
  groupSelectedTab: {},
  setGroupSelectedTab: (category: string, tabId: string) =>
    set((state) => ({
      groupSelectedTab: {
        ...state.groupSelectedTab,
        [category]: tabId,
      },
    })),
  getGroupSelectedTab: (category: string) => {
    const state = get();
    return state.groupSelectedTab[category];
  },
}));

export default useStore;
