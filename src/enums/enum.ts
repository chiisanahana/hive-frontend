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
    ORDER_CANCELLED = 'Order has been cancelled',
    INVALID_BANK_ACCOUNT = 'Bank account number is not found',
    WITHDRAW_SUCCESS = 'Your account balance has been withdrawn',
}

export enum Notif {
    ORDER_PENDING_TITLE = 'New order',
    ORDER_PENDING_MSG = 'You have new order for car {car} in {date} waiting for approval',
    ORDER_CANCEL_TITLE = 'Order cancelled',
    ORDER_CANCEL_MSG = 'Order for car {car} in {date} has been cancelled',
    RENT_APPROVE_TITLE = 'Rent approved',
    RENT_APPROVE_MSG = 'Rent for car {car} in {city} has been approved',
    RENT_REJECT_TITLE = 'Rent rejected',
    RENT_REJECT_MSG = 'Rent for car {car} in {city} has been rejected',
    RENT_COMPLETE_TITLE = 'Rent completed',
    RENT_COMPLETE_MSG = 'Rent for car {car} in {city} has been completed',
    PAYMENT_REFUND_TITLE = 'Payment refund',
    PAYMENT_REFUND_MSG = 'Your rent payment {amount} with invoice {invoice} has been refunded',
    DEPOSIT_REFUND_TITLE = 'Deposit refund',
    DEPOSIT_REFUND_MSG = 'Your rent deposit {amount} with invoice {invoice} has been refunded',
    BALANCE_ADDED_TITLE = 'Balance amount added',
    BALANCE_ADDED_MSG = 'Your income {amount} from order {car} has been added to your balance',
}