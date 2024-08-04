<template>
    <q-footer>
        <div class="row justify-center q-pa-md">
            <div class="col-xs-11 col-sm-10 column">
                <q-img class="q-mb-md" :src="logo" width="80px" />
                <div>
                    HiVe adalah inovasi solutif untuk memenuhi kebutuhan sewa mobil lepas kunci untuk cakupan perjalanan
                    dalam kota.<br>
                    HiVe merupakan singkatan dari Hire Vehicle yang berarti menyewa kendaraan.
                </div>
            </div>
        </div>

        <div class="row justify-center q-pt-md q-px-md q-pb-xs">
            <div class="row items-end col-xs-11 col-sm-10">
                <div class="column">
                    <div class="clickable" @click="goToFaq">
                        FAQ
                    </div>
                    <div class="row items-center">
                        <div class="q-mr-sm">Hubungi kami:</div>
                        <q-btn flat round :icon="ionLogoInstagram" />
                        <q-btn flat round :icon="ionLogoWhatsapp" />
                    </div>
                </div>
                <q-space />
                <div style="margin-bottom: 12px">Copyright &copy; 2024. Hive. All rights reserved</div>
            </div>
        </div>
    </q-footer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import logo from '@/assets/images/logo-white.png';
import { ionLogoInstagram, ionLogoWhatsapp } from '@quasar/extras/ionicons-v6';

const router = useRouter();

function goToFaq() {
    router.push({ name: 'faq' });
}
</script>

<style scoped>
.clickable {
    cursor: pointer
}

.clickable:hover {
    font-weight: bold;
}
</style>