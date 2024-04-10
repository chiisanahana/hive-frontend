import type { Provider } from "@/interfaces/rest/Provider";

export function isValidEmail(email: string) {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return regex.test(email);
}

export function isValidName(name: string) {
    return /^[A-Za-z\s]*$/.test(name);
}

export function isValidPrice(price: string) {
    const regex = /^0+(?:\.0+)?$/;
    return !regex.test(price);
}

export function isHasBankAccount(provider: Provider | undefined) {
    if (provider != undefined &&
        provider.bank_account_number != null &&
        provider.bank_account_number != '') return true;
    return false;
}