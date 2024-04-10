import http from '@/http-common';

class UtilService {
    getLocationList(): Promise<any> {
        return http.get('/customer/dropdown-location');
    }

    generateInvoice(): string {
        return (Math.random().toString(36).slice(2)).toUpperCase();
    }

    getProvinceList(): Promise<any> {
        return http.get('https://alamat.thecloudalert.com/api/provinsi/get/');
    }

    getCityList(provinceId: number): Promise<any> {
        return http.get('https://alamat.thecloudalert.com/api/kabkota/get/', {
            params: { d_provinsi_id: provinceId }
        });
    }

    getBankList(): Promise<any> {
        return http.get('/list-bank');
    }

    getBankAccount(bankCode: string, accNumber: string): Promise<any> {
        return http.get('/bank-account', {
            params: {
                bank_code: bankCode,
                acc_number: accNumber
            }
        })
    }
}

export default new UtilService();