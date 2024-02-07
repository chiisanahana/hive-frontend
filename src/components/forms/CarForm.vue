<template>
    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 300px">
        <p>Input file</p>
        <!-- <div class="q-gutter-md" > -->
        <q-file outlined v-model="model">
            <template v-slot:prepend>
                <q-icon name="attach_file" />
            </template>
        </q-file>
        <!-- </div> -->
        <div>
            <q-btn label="Submit" type="submit" color="primary" />
        </div>
    </q-form>
</template>
  
<script lang="ts">
import { ref } from 'vue'
import { defineComponent } from 'vue';

export default defineComponent ({
    setup() {
        const model = ref(null)
        return {
            model,
            onSubmit() {
                console.log(model);
            },
        }
    }
});
</script>