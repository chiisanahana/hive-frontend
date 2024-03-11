export enum UserType {
    P = 'provider',
    C = 'customer',
    A = 'admin'
}

export enum Message {
    INTERNAL_SERVER_ERROR = 'Unexpected error occured. Please try again later.',
    EMAIL_EXISTS = 'Email is already taken'
}