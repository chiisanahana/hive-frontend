import { date } from 'quasar';
const { addToDate } = date;

export function formatAmount(amount: number | undefined): string {
    if (amount == undefined) return 'Rp0';
    return 'Rp' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatDateDisplay(strDate: string | undefined): string {
    if (strDate == undefined) return '';
    const parsedDate = Date.parse(strDate);
    return date.formatDate(parsedDate, 'D MMM YYYY');
}

export function formatTimeDisplay(strTime: string | undefined): string {
    if (strTime == undefined) return '';
    return strTime.substring(0, 5);
}

export function formatDateBackend(strDate: string): string {
    return strDate.replace(/\//g, '-');
}

export function formatTimestampBackend(strDate: string, strTime: string): string {
    return formatDateBackend(strDate) + 'T' + strTime + 'Z';
}

export function formatTimestampToDate(timestamp: string | undefined): string {
    if (timestamp == undefined) return '';
    return timestamp.substring(0, 10);
}

export function formatTimestampToTime(timestamp: string | undefined): string {
    if (timestamp == undefined) return '';
    return timestamp.substring(11, 16);
}

export function formatTimestampToTimeFull(timestamp: string | undefined): string {
    if (timestamp == undefined) return '';
    return timestamp.substring(11, 19);
}

export function formatTimestampToDateDisplay(timestamp: string | undefined): string {
    if (timestamp == undefined) return '';
    const date = timestamp.substring(0, 10);
    return formatDateDisplay(date);
}

export function formatNameCase(name: string) {
    return name.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}

export function formatChatTime(datetime: string | undefined) {
    if (datetime == undefined) return '';
    const now = formatTimestampToDate(new Date().toISOString());
    const mdate = formatTimestampToDate(datetime);
    if (now == mdate) {
        return formatTimestampToTime(datetime);
    }
    return date.formatDate(datetime, 'D MMM');
}

export function formatRating(rating: number) {
    return Math.round(rating * 10) / 10;
}