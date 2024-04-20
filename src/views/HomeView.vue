<template>
  <div class="row justify-center jumbotron">
    <div class="col-xs-11 col-sm-5 column q-gutter-y-lg q-pt-xl q-mb-lg">
      <div class="text-body1 text-bold text-primary">— Selamat datang di aplikasi HiVe</div>
      <div class="text-h5 text-bold">Rental mobil terpercaya di tangan Anda.</div>
      <div>Cari dan kemudikan mobil pilihan Anda di destinasi pilihan untuk perjalanan dalam kota.</div>
    </div>
    <div class="gt-xs col-1"></div>
    <div class="gt-xs col-4 q-pt-lg">
      <q-img :src="bgImg" :ratio="4 / 3" />
    </div>
  </div>

  <div class="row justify-center q-mb-xl">
    <div class="col-sm-10 col-md-9 col-lg-8">
      <CarSearchForm :routeTo="'cars'" />
    </div>
  </div>

  <div class="row justify-center q-mb-lg">
    <q-card flat class="col-xs-11 col-sm-10">
      <q-card-section>
        <div class="text-h6 text-bold text-primary text-center q-mb-md">Alasan Menggunakan HiVe</div>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="column">
                  <div class="q-pa-sm bg-secondary icon-container">
                    <q-avatar color="primary" textColor="white" :icon="ionCarSport" />
                  </div>
                  <div class="q-mt-md q-ml-sm text-body1 text-bold">Mobil Terawat</div>
                  <div class="q-mt-xs q-ml-sm">
                    Hadirkan kenyamanan dan ketenangan dalam perjalanan Anda dengan kendaraan yang terawat dengan baik
                    dan mempriotaskan keselamatan pengendara.
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-md">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="column">
                  <div class="q-pa-sm bg-secondary icon-container">
                    <q-avatar color="primary" textColor="white" :icon="ionShieldCheckmark" />
                  </div>
                  <div class="q-mt-md q-ml-sm text-body1 text-bold">Pembayaran Aman</div>
                  <div class="q-mt-xs q-ml-sm">
                    Dengan sistem pembayaran yang aman, Anda dapat melanjutkan perjalanan
                    dengan tenang tanpa mengkhawatirkan keamanan transaksi.
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-xs-12 col-md">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="column">
                  <div class="q-pa-sm bg-secondary icon-container">
                    <q-avatar color="primary" textColor="white" :icon="ionFlash" />
                  </div>
                  <div class="q-mt-md q-ml-sm text-body1 text-bold">Selalu Aktif</div>
                  <div class="q-mt-xs q-ml-sm">
                    Butuh menyewa mobil dengan cepat? Lakukan pemesanan dimanapun dan
                    kapanpun melalui aplikasi.
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div class="row justify-center q-mb-lg">
    <q-card flat class="q-px-lg q-py-md col-xs-11 col-sm-10">
      <div class="text-h6 text-bold text-primary text-center q-mb-sm">Cara Kerja HiVe</div>
      <div class="text-center q-mb-lg">Langkah-langkah untuk menyewa mobil melalui HiVe</div>
      <q-timeline :layout="layout" color="primary">
        <q-timeline-entry title="Pilih Destinasi" side="left" :icon="ionLocation">
          <div>
            Tentukan kota destinasi dimana Anda ingin menyewa mobil.
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="Pilih Tanggal dan Waktu" side="right" :icon="ionCalendar">
          <div>
            Tentukan tanggal dan waktu penyewaan Anda.
          </div>
        </q-timeline-entry>

        <q-timeline-entry title="Sewa Mobil Pilihan" side="left" :icon="ionCar">
          <div>
            Tentukan alamat pengambilan dan pengembalian mobil, lalu lakukan
            pembayaran. Pemilik mobil akan mendapatkan notifikasi terkait
            penyewaan Anda. Gunakan fitur chat dengan pemilik mobil jika terdapat pertanyaan.
          </div>
        </q-timeline-entry>
      </q-timeline>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import CarSearchForm from '@/components/forms/CarSearchForm.vue';
import bgImg from '@/assets/images/2.svg';
import { ionCalendar, ionCar, ionCarSport, ionFlash, ionLocation, ionShieldCheckmark } from '@quasar/extras/ionicons-v6';

const quasar = useQuasar();
const layout = computed(() => {
  return quasar.screen.lt.sm ? 'dense' : (quasar.screen.lt.md ? 'comfortable' : 'loose')
});

onBeforeMount(() => {
  quasar.loading.hide();
});
</script>

<style scoped>
.jumbotron {
  background-image: linear-gradient(#FFFFFF, #F6F8F9);
}

.icon-container {
  width: fit-content;
  border-radius: 50%;
}
</style>