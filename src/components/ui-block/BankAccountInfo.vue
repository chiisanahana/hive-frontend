<template>
    <div v-if="!isHasBankAccount(provider)">
        <div class="text-bold q-mb-sm">Bank Account</div>
        <div>-</div>
    </div>
    <div v-else-if="bankName != undefined">
        <div class="text-bold q-mb-sm">Bank Account</div>
        <div class="text-blue-grey-4 q-mb-xs">{{ bankName }}</div>
        <div class="q-mb-xs">{{ accNumber }}</div>
        <div>{{ accName }}</div>
    </div>
    <div v-else class="relative-position" style="height: 100px; width: 100px;">
        <q-inner-loading :showing="bankName == undefined" />
    </div>
</template>

<script setup lang="ts">
import { isHasBankAccount } from '@/composables/validator';
import type { Provider } from '@/interfaces/rest/Provider';
import UtilService from '@/services/util.service';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    provider: Provider
}>();
const bankName = ref<string>();
const accNumber = ref<string>();
const accName = ref<string>();

function getAccountInfo() {
    if (isHasBankAccount(props.provider)) {
        UtilService.getBankAccount(props.provider.bank_code!, props.provider.bank_account_number!)
            .then((response: any) => {
                bankName.value = response.data.data.bankname;
                accNumber.value = response.data.data.accountnumber;
                accName.value = response.data.data.accountname;
            });
    }
}

onMounted(() => {
    getAccountInfo();
});
</script>