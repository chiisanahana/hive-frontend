<template>
    <div class="row">
        <div class="col-3">
            list of chat rooms
        </div>
        <div class="column justify-between col-9 bg-white" style="height: calc(100vh - 69px);">
            <div class="q-pa-md row justify-center">
                <div style="width: 90%;">
                    <q-chat-message :text="['hey, how are you?']" sent />
                    <q-chat-message :text="['doing fine, how r you?']" />
                </div>
            </div>
            <div class="q-pa-md">
                <q-input filled v-model="text">
                    <template v-slot:after>
                        <q-btn round dense flat icon="send" />
                    </template>
                </q-input>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref<string>('');

</script>