<template>
    <q-dialog persistent>
        <q-card class="container">
            <q-card-section>
                <div class="text-body1 text-bold q-mb-md">Withdraw</div>
                <q-input class="col" outlined dense v-model="amount" prefix="Rp" autofocus
                    @update:model-value="() => { amount = clearLeadingZeros(amount) }"
                    placeholder=" Input withdrawal amount" mask="###.###.###.###.###" reverse-fill-mask unmasked-value
                    lazy-rules :rules="[
                        (val) => (val && val.length > 0) || 'Amount is required',
                        (val) => (parseInt(val) > 0) || 'Amount is not valid',
                        (val) => (parseInt(val) <= (totalAmount as number)) || 'Withdrawal limit exceeded'
                    ]" />
                <q-toggle v-model="withdrawAll" label="Withdraw all" @update:model-value="toggleAmount()" />
            </q-card-section>
            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat color="accent" v-close-popup @click="amount = ''">Cancel</q-btn>
                <q-btn color="accent" :disable="!isValidAmount()" @click="withdraw">Confirm</q-btn>
            </q-card-actions>
            <q-inner-loading :showing="isLoading" />
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { Message, UserType } from '@/enums/enum';
import BalanceService from '@/services/balance.service';
import UserService from '@/services/user.service';
import { useProviderStore } from '@/stores/provider';

const props = defineProps<{
    providerId: number,
    totalAmount: number | string
}>();
const emit = defineEmits<{
    close: []
}>();
const quasar = useQuasar();
const amount = ref<string>('');
const withdrawAll = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const providerStore = useProviderStore();

function clearLeadingZeros(str: string) {
    return str.replace(/^0+(?=\d)/, '');
}

function toggleAmount() {
    if (withdrawAll.value) amount.value = props.totalAmount.toString();
    else amount.value = '';
}

function isValidAmount() {
    return amount.value.length > 0 &&
        parseInt(amount.value) > 0 &&
        parseInt(amount.value) < (props.totalAmount as number);
}

function withdraw() {
    isLoading.value = true;
    BalanceService.withdraw(props.providerId, parseInt(amount.value))
        .then((response) => {
            UserService.get(props.providerId, UserType.P)
                .then((response) => {
                    UserService.storeUser(response.data, UserType.P);
                    providerStore.setLoggedInUser(response.data);
                    amount.value = '';
                    isLoading.value = false;
                    emit('close');
                    quasar.notify({
                        color: 'positive',
                        position: 'top-right',
                        message: Message.WITHDRAW_SUCCESS
                    });
                });
        });
}
</script>

<style scoped>
.container {
    min-width: 300px;
}
</style>