<template>
    <div class="row q-pa-md q-col-gutter-md justify-center">
        <div class="col-xs-12 col-md-9">
            <q-card flat>
                <q-card-section>
                    <div class="text-h6">Wishlist</div>
                </q-card-section>
    
                <q-card-section>
                    <div class="row items-center q-mb-md">
                        <q-checkbox toggle-indeterminate class="q-mr-md" v-model="selectAll" color="primary"
                            @click="toggleAllItems" />
                        <div>
                            <span class="text-bold" style="line-height: 42px;">Select All</span>
                            ({{ wishlists.length }})
                        </div>
                        <q-btn v-if="selected.length > 0" flat round size="sm" class="rounded-borders q-ml-md"
                            color="blue-grey-4" :icon="ionTrash" @click="showConfirm = true" />
                    </div>
                    <div v-if="isLoading" v-for="n in 4" :key="n" class="row">
                        <div class="col-auto q-mr-md">
                            <q-skeleton class="q-ma-sm" width="22px" height="22px" />
                        </div>
                        <WishlistCardSkeleton class="col" />
                    </div>
                    <div v-else-if="wishlists.length == 0" class="q-pa-lg text-center text-blue-grey-4">
                        You have no wishlist
                    </div>
                    <div v-else v-for="wishlist in wishlists" class="row">
                        <div class="col-auto q-mr-md">
                            <q-checkbox v-model="selected" :val="wishlist" color="primary" @click="updateToggle" />
                        </div>
                        <WishlistCard class="col" :wishlist="wishlist" />
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
    <ConfirmDialog v-model="showConfirm"
        :message="selected.length > 1 ? 'Are you sure want to delete these items?' : 'Are you sure want to delete this item?'"
        action-btn-title="Delete" @confirm-action="deleteWishlists(selected)" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { Wishlist } from '@/interfaces/rest/Wishlist';
import WishlistService from '@/services/wishlist.service';
import UserService from '@/services/user.service';
import WishlistCard from '@/components/cards/WishlistCard.vue';
import WishlistCardSkeleton from '@/components/skeleton/WishlistCardSkeleton.vue';
import { Message } from '@/enums/enum';
import { ionTrash } from '@quasar/extras/ionicons-v6';
import ConfirmDialog from '@/components/dialog/ConfirmDialog.vue';

const quasar = useQuasar();
const wishlists = ref<Wishlist[]>([]);
const isLoading = ref<boolean>(false);
const selectAll = ref<boolean | null>(false);
const selected = ref<any>([]);
const showConfirm = ref<boolean>(false);

function toggleAllItems() {
    if (selected.value.length == 0) {
        selected.value = wishlists.value;
        selectAll.value = true;
    } else {
        selected.value = [];
        selectAll.value = false;
    }
}

function updateToggle() {
    if (selected.value.length == 0) selectAll.value = false;
    else if (selected.value.length == wishlists.value.length) selectAll.value = true;
    else selectAll.value = null;
}

function getWishlists() {
    isLoading.value = true;
    WishlistService.getByCustomerId(UserService.getLoggedInCust().id)
        .then((response: any) => {
            isLoading.value = false;
            wishlists.value = response.data;
        }).catch((e: Error) => {
            console.error(e);
            isLoading.value = false;
        });
}

function deleteWishlists(wishlists: Wishlist[]) {
    console.log(wishlists);
    isLoading.value = true;
    wishlists.forEach((wishlist: Wishlist) => {
        WishlistService.delete(wishlist.id!).then((response: any) => {
            selected.value = [];
            selectAll.value = false;
            isLoading.value = false;
            getWishlists();
        }).catch((error) => {
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
            isLoading.value = false;
        });
    });
}

onMounted(() => {
    getWishlists();
});
</script>