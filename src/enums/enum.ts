export enum UserType {
    P = 'provider',
    C = 'customer',
    A = 'admin'
}

export enum Message {
    INTERNAL_SERVER_ERROR = 'Terjadi kesalahan. Silakan mencoba kembali nanti.',
    EMAIL_EXISTS = 'Email sudah digunakan',
    WISHLIST_ADD_SUCCESS = 'Item telah ditambahkan ke wishlist',
    WISHLIST_EXISTS = 'Item telah ada di wishlist',
    PROFILE_UPDATE_SUCCESS = 'Profil telah diperbarui',
    CAR_ADD_SUCCESS = 'Mobil telah ditambahkan',
    CAR_UPDATE_SUCCESS = 'Mobil telah diperbarui',
    ORDER_APPROVE_SUCCESS = 'Permintaan sewa telah disetujui',
    ORDER_REJECT_SUCCESS = 'Permintaan sewa telah disetujui',
    ORDER_COMPLETED = 'Sewa telah diselesaikan',
    ORDER_CANCELLED = 'Sewa telah dibatalkan',
    INVALID_BANK_ACCOUNT = 'Rekening bank tidak ditemukan',
    WITHDRAW_SUCCESS = 'Penarikan dana dari saldomu telah berhasil dilakukan!',
}

export enum Notif {
    ORDER_PENDING_TITLE = 'Permintaan baru',
    ORDER_PENDING_MSG = 'Kamu mendapat permintaan sewa untuk {car} pada {date}, menunggu persetujuanmu.',
    ORDER_CANCEL_TITLE = 'Permintaan sewa dibatalkan',
    ORDER_CANCEL_MSG = 'Permintaan sewa untuk mobil {car} pada {date} telah dibatalkan.',
    RENT_APPROVE_TITLE = 'Permintaan sewa disetujui',
    RENT_APPROVE_MSG = 'Permintaan sewa untuk mobil {car} di {city} telah disetujui.',
    RENT_REJECT_TITLE = 'Permintaan sewa ditolak',
    RENT_REJECT_MSG = 'Mohon maaf, permintaan sewa untuk mobil {car} di {city} telah ditolak. Cari mobil lainnya?',
    RENT_COMPLETE_TITLE = 'Sewa diselesaikan',
    RENT_COMPLETE_MSG = 'Sewa mobil {car} di {city} telah selesai.',
    PAYMENT_COMPLETE_TITLE = 'Pembayaran diterima',
    PAYMENT_COMPLETE_MSG = 'Pembayaranmu untuk sewa mobil {car} pada {date} telah diterima. Nikmati perjalananmu!',
    PAYMENT_REFUND_TITLE = 'Pengembalian dana',
    PAYMENT_REFUND_MSG = 'Pembayaran sewa mobil sebesar {amount} dengan invoice {invoice} telah dikembalikan',
    DEPOSIT_REFUND_TITLE = 'Pengembalian deposit',
    DEPOSIT_REFUND_MSG = 'Deposit untuk penyewaan mobil sebesar {amount} dengan invoice {invoice} telah dikembalikan',
    BALANCE_ADDED_TITLE = 'Penambahan saldo',
    BALANCE_ADDED_MSG = 'Pemasukanmu sebesar {amount} dari penyewaan mobil {car} telah ditambahkan ke saldomu.',
}