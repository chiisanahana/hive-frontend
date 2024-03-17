<template>
    <Header />
    <h4>Wishlist</h4>
    <div class="row justify-center">
        <div class="q-pa-md col-8 items-start q-gutter-md">
            <q-card v-ripple class="wishlist-card" v-for="wishlist in wishlists" :key="wishlist.id" @click="clickCard(wishlist.car.id)">
                <!-- <div class="">
                    {{ wishlist.car.provider["trading_name"] }}
                </div> -->
                <q-card-section horizontal class="justify-between q-px-md">
                    <q-card-section horizontal>
                        <div class="q-pa-md q-gutter-sm">
                            <img
                                style="height: 150px; max-width: 250px"
                                img-class="my-custom-image"
                                class="rounded-borders"
                                src="https://daihatsu.co.id/cdn-cgi/image/width=720/https://cms-headless.daihatsu.co.id/assets/bf37106f-5b63-422e-bd34-97d85b5ef068" />
                        </div>
                            <!-- <q-card-section> -->
                        <q-card-actions vertical class="justify-center">
                            <div class="text-h6">{{ wishlist.car.brand }}</div>
                            <div class="text-subtitle2">{{ wishlist.car.provider.city }}, {{ wishlist.car.provider.province }}</div>
                            <q-card-section horizontal class="justify-around">
                                <div class="text-subtitle2">{{ changeDateFormat(wishlist.start_date) }}</div>
                                <div class="text-subtitle2">~</div>
                                <div class="text-subtitle2">{{ changeDateFormat(wishlist.end_date) }}</div>
                            </q-card-section>
                            <q-card-section horizontal class="justify-between">
                                <div class="text-subtitle2">{{ wishlist.start_time }}</div>
                                <div class="text-subtitle2"></div>
                                <div class="text-subtitle2">{{ wishlist.end_time }}</div>
                            </q-card-section>
                        </q-card-actions>
                    </q-card-section>
                    <q-card-actions vertical class="justify-center">
                        <h6>Rp {{calculatePrice(wishlist.start_date, wishlist.end_date, wishlist.car["price"])}}</h6>
                    </q-card-actions>

                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Wishlist } from '@/interfaces/rest/Wishlist';
import WishlistService from '@/services/wishlist.service';
import CryptoService from '@/services/crypto.service';
import Header from '@/layouts/Header.vue'

const router = useRouter();
const wishlists = ref<Wishlist[]>([]);
const visible = ref<boolean>(false);

function changeDateFormat(temp: any){
    let date = new Date(temp);
    // console.log("date: " + date)
    let formattedDate = date.toLocaleDateString('ed-ED', { month: '2-digit', day: '2-digit', year: 'numeric' });
    // console.log("formattedDate: " + formattedDate)

    let monthString = formattedDate.split('/')[0];
    let monthIndex = parseInt(monthString, 10);
    let monthName = "Jan";

    switch (monthIndex) {
    case 1:
        monthName = "Jan";
        break;
    case 2:
        monthName = "Feb";
        break;
    case 3:
        monthName = "Mar";
        break;
    case 4:
        monthName = "Apr";
        break;
    case 5:
        monthName = "May";
        break;
    case 6:
        monthName = "Jun";
        break;
    case 7:
        monthName = "Jul";
        break;
    case 8:
        monthName = "Aug";
        break;
    case 9:
        monthName = "Sep";
        break;
    case 10:
        monthName = "Oct";
        break;
    case 11:
        monthName = "Nov";
        break;
    case 12:
        monthName = "Dec";
        break;
    default:
        monthName = "Unk";
        break;
    }

    let finalDate = formattedDate.split('/')[1] + " " + monthName + " " + formattedDate.split('/')[2];
    // console.log(finalDate);

    return finalDate;
}

function calculatePrice(start_date: any, end_date: any, price: any){
    let startDate = new Date(start_date);
    let endDate = new Date(end_date);
    let diffInMilliseconds = endDate.getTime() - startDate.getTime();
    let diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    console.log(diffInDays);

    return diffInDays*price;
}

function getWishlists() {
    WishlistService.getAll().then((response: any) => {
        console.log(response);
        visible.value = false;
        wishlists.value = response.data;
    }).catch((e: Error) => {
        console.error(e);
    });
}

function clickCard(id: any) {
    const encryptedId = CryptoService.encrypt(id);
    console.log('card clicked ' + id + ' - ' + encryptedId);
    router.push({ name: 'car-details', query: { cid: encryptedId } });
}

onMounted(() => {
    visible.value = true
    getWishlists();
})
</script>@/interfaces/rest/Wishlist

<style>

</style>
