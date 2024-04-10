<template>
    <q-form @submit="submit" class="form shadow-2">
        <p class="text-h5 text-bold text-center q-mt-sm">Login</p>

        <div class="column field q-gutter-y-sm">
            <label class="field-label">Email</label>
            <q-input outlined dense v-model="form.email" placeholder="Enter your email" autocomplete="on" lazy-rules
                :rules="[
        (val) => (val && val.length > 0) || 'Email is required',
        (val) => isValidEmail(val.trim()) || 'Email is not valid',
    ]">
                <template v-slot:prepend>
                    <q-icon :name="ionMail" />
                </template>
            </q-input>
        </div>

        <div class="column field q-gutter-y-sm">
            <label class="field-label">Password</label>
            <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="form.password"
                placeholder="Enter your password" autocomplete="on" lazy-rules :rules="[
        (val) => (val && val.length > 0) || 'Password is required',
    ]">
                <template v-slot:prepend>
                    <q-icon :name="ionLockClosed" />
                </template>

                <template v-slot:append>
                    <q-icon :name="isPwd ? ionEyeOff : ionEye" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
            </q-input>
        </div>

        <div class="column items-center q-mt-md q-gutter-y-lg">
            <q-btn class="full-width q-pa-sm" label="Login" type="submit" color="primary" />
            <p>
                Don't have an account?
                <a class="link cursor-pointer text-accent" @click="$emit('routeToSignUp')">Sign Up</a>
            </p>
        </div>
    </q-form>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted } from 'vue';
import { useQuasar, QSpinnerGears } from 'quasar';
import UserService from '@/services/user.service';
import { isValidEmail } from '@/composables/validator';
import type { UserAuth } from '@/interfaces/UserAuth';
import { Message, UserType } from '@/enums/enum';
import { ionLockClosed, ionMail, ionEyeOff, ionEye } from '@quasar/extras/ionicons-v6';

const props = defineProps<{
    email?: string,
    userType: UserType
}>();

const emit = defineEmits<{
    postAction: [],
    routeToSignUp: []
}>();

const quasar = useQuasar();
const form: UserAuth = reactive({
    email: '',
    password: '',
});
const isPwd = ref<boolean>(true);
const errMsg = ref<string>('');

function submit() {
    quasar.loading.show({ spinner: QSpinnerGears });
    form.email = form.email.trim().toLowerCase();

    UserService.login(form, props.userType)
        .then((response) => {
            storeUserInfo(response.data, props.userType);
            quasar.loading.hide();
            emit('postAction');
        })
        .catch((error) => {
            quasar.loading.hide();
            if (error.response && error.response.status == 401) {
                errMsg.value = 'Login failed. Please check your email or password.';
                form.email = '';
                form.password = '';
            } else {
                errMsg.value = Message.INTERNAL_SERVER_ERROR;
            }

            quasar.notify({
                color: 'negative',
                position: 'top-right',
                message: errMsg.value
            });
        });
}

function storeUserInfo(data: any, type: UserType) {
    if (type == UserType.C) {
        let customer = data['customer'];
        customer.is_provider = data['provider'] == null ? false : true;
        UserService.storeUser(customer, UserType.C);
    } else if (type == UserType.P) {
        UserService.storeUser(data, UserType.P);
    }
}

onBeforeMount(() => {
    quasar.loading.hide();
});

onMounted(() => {
    if (props.email?.length != 0) {
        form.email = props.email || '';
    }
});
</script>

<style scoped>
.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 400px;
    border-radius: 20px;
}

.field-label {
    font-weight: 600;
}

.link {
    text-decoration: none;
    font-weight: 500;
}
</style>
