import http from '@/http-common';
import { UserType } from '@/enums/enum';
import type { UserAuth } from '@/interfaces/UserAuth';
import CryptoService from '@/services/crypto.service';

class UserService {
    get(userId: number, type: UserType): Promise<any> {
        return http.get(`/${type}s/${userId}/`);
    }

    isEmailExists(email: string, type: UserType): Promise<any> {
        // console.log('checking ' + type + ' email ' + email);
        return http.post(`/${type}s/check-email`, { email: email.toLowerCase() });
    }

    register(data: any, type: UserType): Promise<any> {
        if (type == UserType.C) {
            data.name = this._generateUsername();
        }
        return http.post(`/${type}s/`, data);
    }

    login(data: UserAuth, type: UserType): Promise<any> {
        // console.log('login', data, type);
        return http.post(`/${type}/login`, data);
    }

    changePassword(id: number, pwd: string, type: UserType): Promise<any> {
        return http.put(`/${type}s/${id}/`, { password: pwd });
    }

    updateProfile(id: number, data: any, type: UserType): Promise<any> {
        return http.put(`/${type}s/${id}/`, data);
    }

    updateProfilePict(id: number, fileId: string, type: UserType): Promise<any> {
        return http.put(`/${type}s/${id}/`, { profile_picture: fileId });
    }

    storeUser(data: any, type: UserType): void {
        if (type == UserType.C) {
            localStorage.setItem(
                import.meta.env.VITE_CUST_SESSION_KEY,
                CryptoService.encrypt(JSON.stringify(data))
            );
        } else if (type == UserType.P) {
            localStorage.setItem(
                import.meta.env.VITE_PRV_SESSION_KEY,
                CryptoService.encrypt(JSON.stringify(data))
            );
        }
    }

    isLoggedIn(type: UserType): boolean {
        if (type == UserType.C) {
            return localStorage.getItem(import.meta.env.VITE_CUST_SESSION_KEY) != null;
        } else if (type == UserType.P) {
            return localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY) != null;
        }
        return false;
    }

    getLoggedInCust() {
        const data = localStorage.getItem(import.meta.env.VITE_CUST_SESSION_KEY);
        return JSON.parse(CryptoService.decrypt(data!));
    }

    getLoggedInPrv() {
        const data = localStorage.getItem(import.meta.env.VITE_PRV_SESSION_KEY);
        return JSON.parse(CryptoService.decrypt(data!));
    }

    logout(type: UserType): void {
        // if (type == UserType.C) {
        localStorage.removeItem(import.meta.env.VITE_CUST_SESSION_KEY);
        // } else if (type == UserType.P) {
        localStorage.removeItem(import.meta.env.VITE_PRV_SESSION_KEY);
        // }
    }

    private _generateUsername() {
        return (
            ((Math.random() * 26 + 10) | 0).toString(36) +
            Math.random().toString(36).slice(2)
        );
    }
}

export default new UserService();
