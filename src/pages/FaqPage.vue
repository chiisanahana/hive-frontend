<template>
    <div class="row q-pa-md q-pb-none q-col-gutter-md justify-center">
        <div class="col-xs-12 col-md-9">
            <q-card flat>
                <q-card-section>
                    <div class="text-h6 text-center">
                        Pertanyaan yang Sering Diajukan (FAQ)
                        <q-badge align="top">Penyewa</q-badge>
                    </div>
                </q-card-section>

                <q-card-section>
                    <q-list v-for="(question, index) in custQuestions" bordered class="rounded-borders q-mb-sm">
                        <q-expansion-item expand-separator :label=question header-style="font-weight: bold">
                            <q-card>
                                <q-card-section>
                                    {{ custAnswers[index] }}
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <div class="row q-px-md q-col-gutter-md justify-center">
        <div class="col-xs-12 col-md-9">
            <q-card flat>
                <q-card-section>
                    <div class="text-h6 text-center">
                        Pertanyaan yang Sering Diajukan (FAQ)
                        <q-badge align="top">Penyedia</q-badge>
                    </div>
                </q-card-section>

                <q-card-section>
                    <q-list v-for="(question, index) in provQuestions" bordered class="rounded-borders q-mb-sm">
                        <q-expansion-item expand-separator :label=question header-style="font-weight: bold">
                            <q-card>
                                <q-card-section>
                                    {{ provAnswers[index] }}
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const custQuestions = ref<string[]>([
    'Jenis kendaraan apa saja yang disediakan HiVe?',
    'Apakah HiVe menyewakan kendaraan untuk perusahaan?',
    'Apakah menyewa mobil di HiVe dapat menyewa mobil dengan driver?',
    'Apakah armada HiVe sudah dilengkapi asuransi kendaraan?',
    'Bagaimana jika saya menggunakan mobil yang disewa melebihi durasi yang seharusnya?',
    'Apakah saya bisa mengubah jadwal sewa?',
    'Bagaimana dengan biaya sewa yang telah dilakukan jika saya membatalkan pesanan?',
    'Bagaimana jika mobil dicuri ketika saya sewa?'
]);
const custAnswers = ref<string[]>([
    'Kami menyewakan jenis kendaraan yang lebih bervariatif dari berbagai jenis brand yang ada di Indonesia dari berbagai segmen seperti: MPV, Sedan, SUV. Jenis kendaraan yang kami sewakan yaitu kendaaran pribadi/keluarga dan tidak termasuk kendaraan komersial.',
    'Kami menyewakan kendaraan untuk perusahaan maupun perorangan (tanpa pengemudi).',
    'Untuk saat ini opsi penyewaan dengan driver belum tersedia.',
    'Ya, semua armada kami dilengkapi dengan asuransi comprehensive.',
    'Pelanggan akan dikenakan biaya overtime sesuai dengan kelebihan waktu durasi yang telah Anda gunakan. Biaya overtime sebesar 10% per jam dari harga sewa harian yang sudah disepakati.',
    'Reschedule atau perubahan jadwal sewa tidak bisa dilakukan, namun pengguna dapat membatalkan penyewaan dan melakukan penyewaan ulang dengan tanggal yang dihendaki.',
    'Jika pembatalan dilakukan sebelum penyewaan disetujui, biaya sewa akan dikembalikan 100%. Namun jika pembatalan dilakukan setelah disetujui oleh penyedia mobil, maka biaya sewa dinyatakan hangus dan tidak ada pengembalian dana untuk pembatalan sewa kendaraan.',
    'Penyewa diwajibkan segera melapor ke pihak HiVe maksimal 1×24 jam ketika kejadian tersebut terjadi. Pastikan STNK dan kunci kontak kendaraan masih ada di tangan penyewa. Jika tidak memenuhi 2 syarat tersebut, maka penyewa diwajibkan mengganti kendaraan tersebut sebesar 100% dari harga mobil dengan harga pasaran yang wajar sesuai usia kendaraan. Jika memenuhi 2 syarat tersebut, mobil rental kami sudah dilengkapi dengan asuransi All Risk, sehingga penyewa tidak perlu mengganti penuh. Yang menjadi tanggungan penyewa hanya uang deposit dan uang kompensasi kekurangan penggantian asuransi (Harga mobil pasaran - Uang penggantian asuransi).'
]);

const provQuestions = ref<string[]>([
    'Informasi apa yang diperlukan untuk mendaftar sebagai penyedia mobil?',
    'Apakah mobil saya harus memiliki asuransi?',
    'Berapa lama proses pencairan pembayaran setelah pesanan selesai?',
    'Berapa persen penghasilan yang bisa saya peroleh sebagai penyedia mobil?',
    'Bagaimana cara menarik pembayaran saya?'
]);
const provAnswers = ref<string[]>([
    'Untuk mendaftar sebagai penyedia mobil, Anda perlu memasukkan informasi berupa nama lengkap, nomor telepon, email, dan lokasi.',
    'Ya, mobil yang disewakan harus sudah memiliki asuransi comprehensive atau All Risk.',
    'Setelah penyewaan selesai, saldo pada aplikasi dapat dicairkan kapan saja setelah melakukan permintaan pencairan atau withdrawal.',
    'Penyedia mobil dapat menerima penghasilan 100% dari biaya sewa yang telah disepakati sebelumnya, sedangkan biaya platform akan ditanggungkan kepada penyewa.',
    'Penyedia dapat menarik uang melalui menu withdraw yang tersedia. Kemudian, uang akan ditransfer ke rekening bank terdaftar.'
]);

</script>