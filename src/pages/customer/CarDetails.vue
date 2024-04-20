<template>
    <div class="row q-pa-md q-col-gutter-md">
        <div class="col-xs-12 col-md-7 q-gutter-y-md">
            <q-btn flat dense :icon="ionChevronBack" label="Kembali" text-color="accent" @click="goBack" no-caps />
            <q-card flat v-if="car">
                <q-card-section horizontal>
                    <q-card-section class="col-xs-12 col-sm-10 col-md-8">
                        <CarCarousel v-if="car != undefined" :photos="car.car_files" />
                    </q-card-section>
                    <q-card-section class="col-xs-12 col-md">
                        <div class="text-h6 text-bold">{{ car?.brand }}</div>
                        <div class="text-body1 q-mb-md">{{ car?.vehicle_no }}</div>
                        <div class="row">
                            <div class="text-body1">{{ formatAmount(car?.price) }}</div>
                            <span class="text-body1 text-blue-grey-4 q-ml-sm">/day</span>
                        </div>
                        <div class="text-body1">
                            {{ car?.deposit! > 0 ? 'Deposit ' + formatAmount(car?.deposit) : 'Tanpa deposit' }}
                        </div>
                    </q-card-section>
                </q-card-section>
                <q-card-section>
                    <div class="text-body1 text-bold q-mb-sm">Informasi Mobil</div>
                    <div class="row q-gutter-x-md">
                        <CarInfoIcon :icon="ionCarSport" :text="'Tipe'" :value="car?.car_type" />
                        <CarInfoIcon :icon="ionCalendarClear" :text="'Tahun'" :value="car?.year" />
                        <CarInfoIcon :icon="chairAlt" :asset="true" :text="'Kursi'" :value="car?.seat" />
                        <CarInfoIcon :icon="ionColorPalette" :text="'Warna'" :value="car?.color" />
                        <CarInfoIcon :icon="autoTransmission" :asset="true" :text="'Transmisi'"
                        :value="getCarTransmission(car)" />
                        <CarInfoIcon :icon="ionSpeedometer" :text="'Bahan Bakar'" :value="getCarFuel(car)" />
                        <q-space />
                        <div class="rating-box column q-pa-md">
                            <div class="row items-center q-mb-sm">
                                <q-icon name="r_star" size="sm" color="warning" class="q-mr-sm" />
                                <span class="text-bold">{{ car?.rating }}</span>
                            </div>
                            <div>Disewa {{ car?.order_count }} kali</div>
                        </div>
                    </div>
                </q-card-section>
                <q-separator inset />
                <q-card-section>
                    <div class="text-body1 text-bold q-mb-sm">Deskripsi</div>
                    <div class="text-body1" style="white-space: pre-wrap">{{ car?.description }}</div>
                </q-card-section>
            </q-card>
            <CarDetailsSkeleton v-else />
        </div>
        <div class="col q-gutter-y-md">
            <ProviderInfoCard :provider="car?.provider" @go-to-chat="goToChat" />
            <q-card flat>
                <RentDetailsCardSec :editable="true" :rentDetails="rentDetails" v-model:pickupAddress="pickupAddress"
                    v-model:returnAddress="returnAddress" />

                <BillingSumCardSec v-if="rentDetails != undefined" :startDate="rentDetails.startDate"
                    :endDate="rentDetails.endDate" :price="car?.price!" :deposit="car?.deposit!" />

                <q-card-actions align="right">
                    <q-btn unelevated color="secondary" text-color="accent" label="Tambahkan ke wishlist"
                        @click="addToWishlist" />
                    <q-btn color="primary" label="Pesan sekarang" style="min-width: 140px;" :disabled="!isValidInput"
                        @click="bookNow" />
                </q-card-actions>
            </q-card>
        </div>
    </div>
    <q-dialog v-model="loginDialog">
        <div>
            <LoginForm :user-type="UserType.C" @post-action="loginSuccess" @route-to-sign-up="signUp" />
        </div>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import type { Car } from '@/interfaces/rest/Car';
import type { RentDetails } from '@/interfaces/RentDetails';
import type { ChatRoom } from '@/interfaces/rest/ChatRoom';
import { Message, UserType } from '@/enums/enum';
import CarService from '@/services/car.service';
import CryptoService from '@/services/crypto.service';
import UserService from '@/services/user.service';
import WishlistService from '@/services/wishlist.service';
import OrderService from '@/services/order.service';
import ChatService from '@/services/chat.service';
import { formatAmount } from '@/composables/formatter';
import { calcRentBasePrice } from '@/composables/calculator';
import CarCarousel from '@/components/ui-block/CarCarousel.vue';
import CarInfoIcon from '@/components/ui-block/CarInfoIcon.vue';
import ProviderInfoCard from '@/components/cards/ProviderInfoCard.vue';
import RentDetailsCardSec from '@/components/cards/RentDetailsCardSec.vue';
import BillingSumCardSec from '@/components/cards/BillingSumCardSec.vue';
import LoginForm from '@/components/forms/LoginForm.vue';
import { ionChevronBack, ionCarSport, ionCalendarClear, ionColorPalette, ionSpeedometer } from '@quasar/extras/ionicons-v6';
import autoTransmission from '@/assets/icons/auto_transmission.svg';
import chairAlt from '@/assets/icons/chair_alt.svg';
import PaymentService from '@/services/payment.service';
import { useChatStore } from '@/stores/chat';
import CarDetailsSkeleton from '@/components/skeleton/CarDetailsSkeleton.vue';
import { getCarFuel, getCarTransmission } from '@/composables/getter';

const route = useRoute();
const router = useRouter();
const quasar = useQuasar();
const car = ref<Car>();
const rentDetails = ref<RentDetails>();
const rentBasePrice = ref<number>(0);
const rentPrice = ref<number>(0);
const loginDialog = ref<boolean>(false);
const pickupAddress = ref<string>('');
const returnAddress = ref<string>('');
const isValidInput = computed(() => pickupAddress.value !== '' && returnAddress.value !== '');
const chatStore = useChatStore();

watch(
    () => route.query.cid,
    async newId => {
        const isWishlist = route.query.w;
        if (isWishlist) getCarFromWishlist(parseInt(CryptoService.decrypt(newId?.toString() || '')));
        else getCar(parseInt(CryptoService.decrypt(newId?.toString() || '')));
    }
)

function goBack() {
    router.push({ name: 'cars' });
}

function goToChat() {
    quasar.loading.show({ spinner: QSpinnerGears });
    if (car.value != undefined && car.value.provider != undefined) {
        ChatService.createOrGetRoom(UserService.getLoggedInCust().id, car.value.provider.id)
            .then((response) => {
                chatStore.setCurrentRoom(response.data as ChatRoom);
                quasar.loading.hide();
                router.push({ name: 'chat' });
            })
            .catch((error) => {
                quasar.loading.hide();
                quasar.notify({
                    color: 'negative',
                    position: 'top-right',
                    message: Message.INTERNAL_SERVER_ERROR
                });
            });
    }
}

function getCar(carId: number) {
    // quasar.loading.show({ spinner: QSpinnerGears });
    CarService.get(carId).then((response: any) => {
        // console.log(response);
        car.value = response.data;
        rentBasePrice.value = calcRentBasePrice(rentDetails.value?.startDate!, rentDetails.value?.endDate!, car.value?.price!);
        rentPrice.value = rentBasePrice.value + +car.value?.deposit!;
        // console.log('get', rentBasePrice.value, rentPrice.value);
        // quasar.loading.hide();
    }).catch((e: Error) => {
        console.error(e);
        // quasar.loading.hide();
    });
}

function getCarFromWishlist(wishlistId: number) {
    quasar.loading.show({ spinner: QSpinnerGears });
    WishlistService.get(wishlistId).then((response: any) => {
        car.value = response.data.car;
        rentDetails.value = {
            city: response.data.car.provider.city,
            province: response.data.car.provider.province,
            startDate: response.data.start_date,
            startTime: response.data.start_time,
            endDate: response.data.end_date,
            endTime: response.data.end_time,
            pickupAddress: '',
            returnAddress: ''
        } as RentDetails;
        rentBasePrice.value = calcRentBasePrice(rentDetails.value?.startDate!, rentDetails.value?.endDate!, car.value?.price!);
        rentPrice.value = rentBasePrice.value + +car.value?.deposit!;

        // console.log('get from wishlist', rentBasePrice.value, rentPrice.value);
        quasar.loading.hide();
    }).catch((e: Error) => {
        console.error(e);
        quasar.loading.hide();
    });
}

function setRentDetailsValue() {
    if (rentDetails.value != undefined) {
        rentDetails.value.pickupAddress = pickupAddress.value;
        rentDetails.value.returnAddress = returnAddress.value;
    }
}

function addToWishlist() {
    if (!UserService.isLoggedIn(UserType.C)) {
        loginDialog.value = true;
        return;
    }

    quasar.loading.show({ spinner: QSpinnerGears })
    setRentDetailsValue();
    WishlistService.addWishlist(
        car.value?.id!, UserService.getLoggedInCust().id, rentDetails.value!
    ).then((response) => {
        quasar.loading.hide();
        quasar.notify({
            color: 'primary',
            position: 'bottom',
            message: Message.WISHLIST_ADD_SUCCESS
        });
    }).catch((error) => {
        quasar.loading.hide();
        quasar.notify({
            color: 'primary',
            position: 'bottom',
            message: Message.WISHLIST_EXISTS
        });
    });
}

function bookNow() {
    if (!UserService.isLoggedIn(UserType.C)) {
        loginDialog.value = true;
        return;
    }

    quasar.bottomSheet({
        class: 'payment-opt',
        message: 'Pilih metode pembayaran',
        actions: [
            {
                label: 'BCA Virtual Account',
                img: '/src/assets/images/va.png',
                id: 'va'
            },
            // {
            //     label: 'Credit Card',
            //     img: '/src/assets/images/cc.png',
            //     id: 'cc'
            // },
        ]
    }).onOk(action => {
        quasar.loading.show({ spinner: QSpinnerGears });
        setRentDetailsValue();
        OrderService.createOrder(
            car.value?.id!, UserService.getLoggedInCust().id, rentBasePrice.value, rentDetails.value!
        ).then((response) => {
            // console.log('order created', response.data)
            PaymentService.initiatePayment(
                response.data.id,
                action.id == 'va' ? 'Virtual Account' : 'Credit Card',
                rentPrice.value,
            ).then((response) => {
                const encryptedId = CryptoService.encrypt(response.data.order_id);
                quasar.loading.hide();
                router.push({ name: 'payment', query: { oid: encryptedId } })
            }).catch((error) => {
                console.log(error);
                quasar.loading.hide();
                quasar.notify({
                    color: 'negative',
                    position: 'top-right',
                    message: Message.INTERNAL_SERVER_ERROR
                });
            })
        }).catch((error) => {
            quasar.loading.hide();
            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: Message.INTERNAL_SERVER_ERROR
            });
        })
    });
}

function loginSuccess() {
    // nothing to do
}

function signUp() {
    router.push({ name: 'sign-up' });
}

onBeforeMount(() => {
    // load rent data
    const data = localStorage.getItem(import.meta.env.VITE_SESSION_DATA);
    if (data != null) {
        rentDetails.value = JSON.parse(CryptoService.decrypt(data));
    }

    // load car data
    const id = route.query.cid;
    const isWishlist = route.query.w;
    if (typeof id === 'string') {
        if (isWishlist) getCarFromWishlist(parseInt(CryptoService.decrypt(id)));
        else getCar(parseInt(CryptoService.decrypt(id)));
    }
});
</script>

<style scoped>
.rating-box {
    background-color: #ECF1FF;
    border-radius: 4px;
}

.billing-separator {
    border: none;
    border-top: 2px dashed #D1D1D1;
    height: 3px;
}
</style>

<style>
.q-bottom-sheet--list img {
    width: 42px;
    height: auto;
}

.q-dialog__inner:has(.payment-opt) {
    justify-content: end;
}
</style>