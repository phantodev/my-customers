import { create } from "zustand";

export const useStore = create((set) => ({
  tempCustomer: null,
  setTempCustomer: (tempCustomer) => set({ tempCustomer }),
}));
