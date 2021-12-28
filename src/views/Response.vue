<script lang="ts" setup>

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import PartyResponse from '@/components/PartyResponse.vue'
import PlusOneResponse from '@/components/PlusOneResponse.vue'
import SingleResponse from '@/components/SingleResponse.vue'
import { useGuestStore } from '../stores/guest'


const props = defineProps({
    guestId: {
        type: String,
        required: true,
    }
})

const guestStore = useGuestStore()

const {
    guest,
    guestId,
    error,
    isLoading,
    isReady,
} = storeToRefs(guestStore)

guestId.value = props.guestId

const responseComponent = computed(() => {
    if (guest.value.hasPlusOne) {
        return PlusOneResponse
    } else if (guest.value.hasOwnProperty('party') && guest.value.party.length) {
        return PartyResponse
    }

    return SingleResponse
})

</script>

<template>
    <transition name="fade" mode="out-in">
        <component v-if="guest" :is="responseComponent" 
            :guest="guest"
        ></component>
        <div v-else class="is-flex is-flex-direction-column is-align-items-center">
            <p class="is-size-4">Fetching your information</p>
            <span class="loader is-size-3"></span>
        </div>
    </transition>
</template>

