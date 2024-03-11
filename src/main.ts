import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Loading, Notify } from 'quasar';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/ionicons-v6';
import quasarIconSet from 'quasar/icon-set/svg-ionicons-v6';
import '@/assets/styles/app.scss';
import 'quasar/src/css/index.sass';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(Quasar, {
    plugins: {
        Loading,
        Notify
    },
    iconSet: quasarIconSet,
});
app.use(router);

app.mount('#app');
