export function isValidEmail(email: string) {
    const regex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return regex.test(email);
}

export function isValidName(name: string) {
    return /^[A-Za-z\s]*$/.test(name);
}