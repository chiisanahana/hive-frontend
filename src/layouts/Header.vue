<template>
    <div>
        <q-toolbar class="bg-primary text-white">
            <q-avatar>
                <img :src="logoUrl">
            </q-avatar>

            <q-toolbar-title>HiVe</q-toolbar-title>

            <div class="q-pa-md q-gutter-md">
                <q-btn to="/login" flat color="secondary" label="Log in" />
                <q-btn to="/sign-up" unelevated color="secondary" text-color="accent" label="Sign up" />
            </div>
        </q-toolbar>
    </div>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo-temp.png'
</script>