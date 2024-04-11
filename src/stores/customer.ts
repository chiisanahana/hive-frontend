import { defineStore } from 'pinia'
import type { Customer } from '@/interfaces/rest/Customer';
import CryptoService from '@/services/crypto.service';

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customer: null as Customer | null
    }),
    getters: {
        getLoggedInUser(): any {
            if (this.customer != null) return this.customer;
            const data = localStorage.getItem(import.meta.env.VITE_CUST_SESSION_KEY);
            if (data != null) {
                return JSON.parse(CryptoService.decrypt(data));
            }
            return null;
        }
    },
    actions: {
        setLoggedInUser(customer: Customer): void {
            this.customer = customer;
        },
        logout(): void {
            this.customer = null;
        }
    }
});
