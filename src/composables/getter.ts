export function getOrderStatus(status: string): string {
    switch (status) {
        case '0':
            return 'Payment Pending';
        case '1':
            return 'Approval Pending';
        case '2':
            return 'Approved';
        case '3':
            return 'Fee Payment Pending';
        case '4':
            return 'Completed';
        case '5':
            return 'Cancelled';
        case '6':
            return 'Rejected';
    
        default:
            return '';
    }
}