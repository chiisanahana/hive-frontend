export enum UserType {
    P = 'provider',
    C = 'customer',
    A = 'admin'
}

export enum Message {
    INTERNAL_SERVER_ERROR = 'Unexpected error occured. Please try again later.',
    EMAIL_EXISTS = 'Email is already taken',
    WISHLIST_ADD_SUCCESS = 'Item has been added to wishlist',
    WISHLIST_EXISTS = 'Item already in wishlist',
    PROFILE_UPDATE_SUCCESS = 'Account has been updated'
}