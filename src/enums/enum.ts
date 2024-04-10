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
    PROFILE_UPDATE_SUCCESS = 'Account has been updated',
    CAR_ADD_SUCCESS = 'Car has been added',
    CAR_UPDATE_SUCCESS = 'Car has been updated',
    ORDER_APPROVE_SUCCESS = 'Order has been approved',
    ORDER_REJECT_SUCCESS = 'Order has been rejected',
    ORDER_COMPLETED = 'Order has been completed',
    INVALID_BANK_ACCOUNT = 'Bank account number is not found',
    WITHDRAW_SUCCESS = 'Your account balance has been withdrawn',
}