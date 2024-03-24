<template>
    <div class="row q-pa-md q-gutter-md justify-center">
        <q-card flat class="col-9">
            <q-card-section>
                <div class="text-h6">Wishlist ({{ wishlists.length }})</div>
            </q-card-section>

            <q-card-section>
                <WishlistCardSkeleton v-if="isLoading" v-for="n in 4" :key="n" />
                <div v-else-if="wishlists.length == 0" class="q-pa-lg text-center text-blue-grey-4">
                    You have no wishlist
                </div>
                <WishlistCard v-for="wishlist in wishlists" :wishlist="wishlist" />
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Wishlist } from '@/interfaces/rest/Wishlist';
import WishlistService from '@/services/wishlist.service';
import UserService from '@/services/user.service';
import WishlistCard from '@/components/cards/WishlistCard.vue';
import WishlistCardSkeleton from '@/components/skeleton/WishlistCardSkeleton.vue';

const wishlists = ref<Wishlist[]>([]);
const isLoading = ref<boolean>(false);

function getWishlists() {
    isLoading.value = true;
    WishlistService.getByCustomerId(UserService.getLoggedInCust().id)
        .then((response: any) => {
            // console.log(response);
            isLoading.value = false;
            wishlists.value = response.data;
        }).catch((e: Error) => {
            console.error(e);
            isLoading.value = false;
        });
}

onMounted(() => {
    getWishlists();
});
</script>