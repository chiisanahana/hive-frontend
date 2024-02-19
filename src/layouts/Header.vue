<template>
    <div>
        <q-toolbar class="bg-secondary text-primary">
            <q-avatar>
                <img :src="logoUrl">
            </q-avatar>

            <q-toolbar-title>HiVe</q-toolbar-title>

            <div class="q-pa-md q-gutter-md">
                <q-btn to="/login" outline color="primary" label="Log in" />
                <q-btn to="/login" color="primary" label="Sign up" />
            </div>
        </q-toolbar>
    </div>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logo-temp.png'
</script>