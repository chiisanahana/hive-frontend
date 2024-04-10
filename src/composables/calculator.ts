import { date } from 'quasar';

export function calcDateDiff(startDate: string, endDate: string): number {
    const dateDiff = date.getDateDiff(Date.parse(endDate), Date.parse(startDate), 'days');
    return dateDiff + 1;
}

export function calcRentBasePrice(startDate: string, endDate: string, basePrice: number): number {
    return basePrice * calcDateDiff(startDate, endDate);
}

export function calcRentPrice(startDate: string, endDate: string, basePrice: number, deposit: number): number {
    return basePrice * calcDateDiff(startDate, endDate) + +deposit;
}

export function calcTimeDiff(timestamp1: string, timestamp2: string): number {
    const timediff = date.getDateDiff(Date.parse(timestamp2), Date.parse(timestamp1), 'minutes');
    return timediff;
}
