import type { Car } from "@/interfaces/rest/Car";
import type { CarFile } from "@/interfaces/rest/CarFile";
import type { Customer } from "@/interfaces/rest/Customer";
import type { Payment } from "@/interfaces/rest/Payment";
import type { Provider } from "@/interfaces/rest/Provider";
import FileService from "@/services/file.service";

export function getOrderStatus(status: string): string {
    switch (status) {
        case '0':
            return 'Menunggu Pembayaran';
        case '1':
            return 'Menunggu Persetujuan';
        case '2':
            return 'Disetujui';
        case '3':
            return 'Menunggu Pembayaran Denda';
        case '4':
            return 'Selesai';
        case '5':
            return 'Dibatalkan';
        case '6':
            return 'Ditolak';
    
        default:
            return '';
    }
}

export function getPaymentMethod(payment: Payment | undefined): string {
    if (payment == undefined) return '';
    return payment.payment_method == 'credit_card' ? 'Kartu Kredit' : 'Virtual Account';
}

export function getCarTransmission(car: Car | undefined): string {
    if (car == undefined) return '';
    return car.transmission == '1' ? 'Otomatis' : 'Manual';
}

export function getCarStatus(car: Car | undefined): string {
    if (car == undefined) return '';
    return car.status == '1' ? 'Aktif' : 'Inaktif';
}

export function getCarFuel(car: Car | undefined): string {
    if (car == undefined) return '';
    return car.status == '1' ? 'Bensin' : 'Elektrik';
}

export function getCarImg(img: CarFile | null): string {
    if (img != null) {
        return FileService.getFile(img.file_path).href;
    }
    return '';
}

export function getProfPict(user: Customer | Provider | undefined): string {
    if (user != undefined && user.profile_picture != undefined) {
        return FileService.getFile(user.profile_picture).href;
    }
    return '';
}