<script lang="ts" setup>
import { useResponseStore } from '../stores/response'
import { LocationQueryRaw, useRouter } from 'vue-router'


const props = defineProps({
    onBeforeSend: {
        type: Function,
        required: false,
    }
})

const responseStore = useResponseStore()
const router = useRouter()

function onResponse() {
    const query: LocationQueryRaw = {
        coming: responseStore.isMainGuestComing?.toString(),
        guestCount: responseStore.numGuestsComing,
    }

    if (props.onBeforeSend) {
        props.onBeforeSend()
    }

    responseStore.send().then(() => {
        router.push({ name: 'thanks', query: query })
    })
}

</script>

<template>
    <button
        class="is-large is-primary button"
        :class="{ 'is-loading': responseStore.isLoading }"
        @click="onResponse"
    >
        Submit My Response
    </button>
</template>
