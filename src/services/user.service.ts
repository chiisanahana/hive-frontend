import http from "@/http-common";
import { UserType } from "@/enums/enum";
import type { UserAuth } from "@/interfaces/UserAuth";
import CryptoService from "@/services/crypto.service";

class UserService {
    isEmailExists(email: string, type: UserType): Promise<any> {
        console.log("checking " + type + " email " + email);
        return http.post(`/${type}s/check-email`, { email: email });
    }

    register(data: UserAuth, type: UserType): Promise<any> {
        console.log("register", data, type);
        return http.post(`/${type}s/`, {
            email: data.email,
            password: data.password,
            name: this._generateUsername(),
        });
    }

    login(data: UserAuth, type: UserType): Promise<any> {
        console.log("login", data, type);
        return http.post(`/${type}/login`, data);
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

    logout(type: UserType): void {
        if (type == UserType.C) {
            localStorage.removeItem(import.meta.env.VITE_CUST_SESSION_KEY);
        } else if (type == UserType.P) {
            localStorage.removeItem(import.meta.env.VITE_PRV_SESSION_KEY);
        }
    }

    private _generateUsername() {
        return (
            ((Math.random() * 26 + 10) | 0).toString(36) +
            Math.random().toString(36).slice(2)
        );
    }
}

export default new UserService();
