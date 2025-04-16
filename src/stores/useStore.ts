import type { TUser } from "@/pages/finance";
import { create } from "zustand";
import { persist } from "zustand/middleware";


type TStore = {
  tempCustomer: null | TUser;
  setTempCustomer: (tempCustomer: TUser | null) => void;
}

export const useStore = create<TStore>()(persist((set) => ({
  tempCustomer: null,
  setTempCustomer: (tempCustomer) => set({ tempCustomer }),
}),
{
  name: 'mainStore',
}));

