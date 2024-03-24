import { date } from 'quasar';

export function calcDateDiff(startDate: string, endDate: string): number {
    const dateDiff = date.getDateDiff(Date.parse(endDate), Date.parse(startDate), 'days');
    return dateDiff + 1;
}

export function calcRentPrice(startDate: string, endDate: string, basePrice: number, deposit: number): number {
    return basePrice * calcDateDiff(startDate, endDate) + +deposit;
}