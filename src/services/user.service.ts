import http from '@/http-common';
import { UserType } from '@/enums/enum';
import type { UserAuth } from '@/interfaces/UserAuth';

class UserService {
    isEmailExists(email: string, type: UserType): Promise<any> {
        console.log("checking " + type + " email " + email);
        return http.post(`/${type}s/check-email`, { email: email });
    }

    register(data: UserAuth, type: UserType): Promise<any> {
        console.log("register", data, type);
        return http.post(`/${type}s/`, data);
    }

    login(data: UserAuth, type: UserType): Promise<any> {
        console.log("login", data, type);
        return http.post('/customer/login', data);
        // TODO: create login provider
    }
}

export default new UserService();