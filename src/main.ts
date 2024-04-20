import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Loading, Notify, BottomSheet } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-icons-round/material-icons-round.css';
import '@quasar/extras/ionicons-v6';
import quasarIconSet from 'quasar/icon-set/svg-ionicons-v6';
import quasarLang from 'quasar/lang/id'
import '@/assets/styles/app.scss';
import 'quasar/src/css/index.sass';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import VueCountdown from '@chenfengyuan/vue-countdown';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(Quasar, {
    plugins: {
        Loading,
        Notify,
        BottomSheet
    },
    iconSet: quasarIconSet,
    lang: quasarLang,
});
app.use(router);
app.component(VueCountdown.name!, VueCountdown);
defineElement(lottie.loadAnimation);

app.mount('#app');
