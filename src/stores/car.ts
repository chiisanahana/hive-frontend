import { defineStore } from "pinia";
import type { Car } from "@/interfaces/Car";

export const useCarStore = defineStore("car", {
  state: () => ({ car: null as Car | null }),
  getters: {
    getToEdit(): any {
        return this.car;
    }
  },
  actions: {
    storeToEdit(car: Car) {
      this.car = car;
    },
  },
});
