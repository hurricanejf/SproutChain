import { create } from "zustand";

type CreatureState = {
  stage: number;
  setStage: (n: number) => void;
};

export const useCreatureStore = create<CreatureState>((set) => ({
  stage: 1,
  setStage: (n) => set({ stage: n })
}));
