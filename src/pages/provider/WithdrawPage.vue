<template>
    <q-banner v-if="!isHasBankAccount(provider) && showBanner" dense class="bg-primary text-white">
        <template v-slot:avatar>
            <q-icon :name="ionWallet" color="white" />
        </template>
        Please fill in your bank account to withdraw.
        <template v-slot:action>
            <q-btn flat color="white" label="Dismiss" @click="showBanner = false" />
            <q-btn flat color="white" label="Update Bank Account" @click="goToSetting" />
        </template>
    </q-banner>

    <div class="row q-col-gutter-md q-pa-md">
        <div class="col-4">
            <q-card flat>
                <q-card-section>
                    <div class="row q-gutter-md items-center q-mb-lg">
                        <q-icon :name="ionCash" size="md" color="primary"></q-icon>
                        <div class="column">
                            <div>Total Balance</div>
                            <div class="text-h6 text-bold">{{ formatAmount(provider.balance) }}</div>
                        </div>
                    </div>
                    <q-btn color="primary" label="Withdraw" :disable="!isHasBankAccount(provider) || !isHasBalance()"
                        @click="showDialog = true" />
                </q-card-section>
                <q-card-section class="q-mt-md">
                    <BankAccountInfo :provider="provider" />
                </q-card-section>
            </q-card>
        </div>
        <div class="col">
            <q-card flat class="full-height">
                <q-card-section>
                    <div class="text-h6 q-mb-md">Balance History</div>
                    <q-card flat>
                        <q-tabs v-model="tab" @update:model-value="filterHistory" dense class="text-grey"
                            active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
                            <q-tab v-for="tab in tabs" :name="tab" :label="tab" />
                        </q-tabs>

                        <q-separator />

                        <q-tab-panels v-model="tab" animated>
                            <q-tab-panel v-for="tab in tabs" :name="tab">
                                <div v-if="isLoading" v-for="i in 3">
                                    <BalanceSkeleton />
                                    <q-separator v-if="i != 3" />
                                </div>
                                <div v-else-if="history.length > 0">
                                    <q-scroll-area :class="showBanner ? 'scroll-area-banner' : 'scroll-area'">
                                        <div v-for="h in history">
                                            <q-item>
                                                <q-item-section>
                                                    <q-item-label>{{ h.is_income ? 'Payment for rent' : 'Withdrawal'
                                                        }}</q-item-label>
                                                    <q-item-label caption lines="2">
                                                        <span class="q-mr-md">
                                                            Date: {{ formatDateDisplay(h.transaction_datetime) }}
                                                        </span>
                                                        <span>
                                                            Time: {{ formatTimestampToTime(h.transaction_datetime) }}
                                                        </span>
                                                    </q-item-label>
                                                </q-item-section>
                                                <q-item-section side top>
                                                    <q-item-label
                                                        :class="h.is_income ? 'text-positive' : 'text-negative'">{{
                                                        formatAmount(h.amount) }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-separator v-if="h.id != history[history.length - 1].id" />
                                        </div>
                                    </q-scroll-area>
                                </div>
                                <div v-else class="q-ma-md text-center">No history</div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </q-card>
                </q-card-section>
            </q-card>
        </div>
    </div>
    <WithdrawalDialog v-model="showDialog" :provider-id="provider.id" :total-amount="provider.balance"
        @close="closeDialog" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { formatAmount, formatDateDisplay, formatTimestampToTime } from '@/composables/formatter';
import { ionCash, ionWallet } from '@quasar/extras/ionicons-v6';
import type { Provider } from '@/interfaces/rest/Provider';
import type { BalanceHistory } from '@/interfaces/rest/BalanceHistory';
import UserService from '@/services/user.service';
import BalanceService from '@/services/balance.service';
import { isHasBankAccount } from '@/composables/validator';
import BalanceSkeleton from '@/components/skeleton/BalanceSkeleton.vue';
import BankAccountInfo from '@/components/ui-block/BankAccountInfo.vue';
import WithdrawalDialog from '@/components/dialog/WithdrawalDialog.vue';

const router = useRouter();
const provider = ref<Provider>(UserService.getLoggedInPrv());
const showBanner = ref<boolean>(true);
const data = ref<BalanceHistory[]>([]);
const history = ref<BalanceHistory[]>([]);
const tabs = ref<string[]>(['all', 'income', 'withdrawal']);
const tab = ref<string>('all');
const isLoading = ref<boolean>(false);
const showDialog = ref<boolean>(false);

function goToSetting() {
    router.push({ name: 'provider-account' });
}

function isHasBalance() {
    return provider.value.balance > 0;
}

function getBalanceHistory() {
    isLoading.value = true;
    BalanceService.getHistory(provider.value.id).then((response) => {
        data.value = response.data;
        history.value = data.value;
        isLoading.value = false;
    });
}

function filterHistory(tab: any) {
    switch (tab) {
        case 'all':
            history.value = data.value;
            break;
        case 'income':
            history.value = data.value.filter((history: any) => {
                return history.is_income;
            })
            break;
        case 'withdrawal':
            history.value = data.value.filter((history: any) => {
                return !history.is_income;
            })
            break;

        default:
            break;
    }
}

function closeDialog() {
    showDialog.value = false;
    getBalanceHistory();
    provider.value = UserService.getLoggedInPrv();
}

onMounted(() => {
    getBalanceHistory();
})
</script>

<style scoped>
.scroll-area {
    height: calc(100vh - 60px - 16px - 100px - 64px - 1px);
}

.scroll-area-banner {
    height: calc(100vh - 60px - 16px - 100px - 64px - 1px - 88px);
}
</style>