<template>
    <q-dialog v-model="model" :persistent="isLoading">
        <q-card class="q-pa-lg">
            <q-form @submit="submit" class="form column items-center">
                <p class="text-body1 text-bold text-center q-mt-sm">How was your rent experience?</p>
                <div v-if="isLoading" class="q-pa-md">
                    <lord-icon trigger="loop" src="/src/assets/icons/shooting-stars.json"
                        style="width: 120px; height: 120px"></lord-icon>
                </div>
                <div v-else-if="isSuccess" class="row q-pa-md">
                    <div class="column items-center">
                        <lord-icon trigger="in" src="/src/assets/icons/star.json"
                            style="width: 120px; height: 120px"></lord-icon>
                        <div class="text-center q-mt-lg">Thanks for sharing your experience!</div>
                    </div>
                </div>

                <div v-else class="q-pa-md">
                    <div class="column items-center">
                        <div class="q-gutter-y-md column q-mb-lg">
                            <q-rating v-model="rating" size="3.5em" color="yellow-7" icon="star_border" icon-selected="star" />
                        </div>
                        <q-space />
                        <q-btn class="q-mt-lg" label="Rate" type="submit" color="primary" :disable="rating == 0" style="width: 140px;" />
                    </div>
                </div>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import OrderService from '@/services/order.service';
import { Message } from '@/enums/enum';

const props = defineProps<{
    orderId: number;
}>();
const emit = defineEmits<{
    postRate: [orderId: number, rating: number]
}>();
const quasar = useQuasar();
const model = ref<boolean>(true);
const rating = ref<number>(0);
const isLoading = ref<boolean>(false);
const isSuccess = ref<boolean>(false);

function submit() {
    isLoading.value = true;
    OrderService.rateOrder(props.orderId, rating.value).then((response) => {
        emit('postRate', props.orderId, rating.value);
        isLoading.value = false;
        isSuccess.value = true;
    }).catch((error) => {
        model.value = false;
        quasar.notify({
            color: 'negative',
            position: 'top-right',
            message: Message.INTERNAL_SERVER_ERROR
        });
    })
}
</script>

<style scoped>
.form {
    width: 300px;
}
</style>