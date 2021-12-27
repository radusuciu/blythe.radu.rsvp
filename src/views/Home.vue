<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FindGuest from '@/components/FindGuest.vue'
import { useGuestStore } from '../stores/guest'

const router = useRouter()
const responded = ref(false)
const guestStore = useGuestStore()

// guestStore.clear()

function onRightGuest(foundGuest) {
    responded.value = true
    console.log(foundGuest)
    router.push({ name: 'response', params: { guestId: foundGuest.id }})
}

function onWrongGuest() {
    responded.value = true
}

</script>

<template>
    <FindGuest
        @rightGuest="onRightGuest"
        @wrongGuest="onWrongGuest"
    />
</template>
