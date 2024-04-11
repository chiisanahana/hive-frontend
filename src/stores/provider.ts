import { defineStore } from 'pinia'
import type { Provider } from '@/interfaces/rest/Provider';
import CryptoService from '@/services/crypto.service';

export const useProviderStore = defineStore('provider', {
    state: () => ({
        provider: null as Provider | null
    }),
    getters: {
        getLoggedInUser(): any {
            if (this.provider != null) return this.provider;
            const data = localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY);
            if (data != null) {
                return JSON.parse(CryptoService.decrypt(data));
            }
            return null;
        }
    },
    actions: {
        setLoggedInUser(provider: Provider): void {
            this.provider = provider;
        },
        logout(): void {
            this.provider = null;
        }
    }
});
