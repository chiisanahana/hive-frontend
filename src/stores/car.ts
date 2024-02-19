import { defineStore } from "pinia";
import type { Car } from "@/interfaces/Car";

export const useCarStore = defineStore("car", {
  state: () => ({
    cars: null as Car[] | null,
    car: null as Car | null,
  }),
  getters: {
    getFilteredCars(): any {
      return this.cars;
    },
    getCarToEdit(): any {
      return this.car;
    }
  },
  actions: {
    setFilteredCars(cars: Car[] | null): void {
      this.cars = cars;
    },
    setCarToEdit(car: Car) {
      this.car = car;
    },
  },
});
