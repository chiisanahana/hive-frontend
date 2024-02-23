import CryptoJS from 'crypto-js';

class CryptoService {
    private key: string = 'lulustepatwaktu';

    encrypt(data: any): string {
        if (data) {
            const encrypted = CryptoJS.AES.encrypt(data.toString(), this.key);
            return encrypted.toString();
        }
        return '';
    }

    decrypt(cipher: string): string {
        const decrypted = CryptoJS.AES.decrypt(cipher, this.key);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}

export default new CryptoService();