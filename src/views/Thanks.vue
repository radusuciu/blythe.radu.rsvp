<script setup lang="ts">

import { useRouter } from 'vue-router'

const router = useRouter()


const props = defineProps({
    coming: {
        type: [Boolean, String],
        required: true
    },
    guestCount: {
        type: [Number, String],
        required: true,
    },
    totalGuests: {
        type: [Number, String],
        required: true,
    }
})

const isComing = props.coming.toString() === 'true'
const numGuests = parseInt(props.guestCount.toString(), 10)

// TODO: use router-link
function rsvp() {
    router.push({ name: 'home' })
}

</script>

<template>
    <div class="thanks">
        <h1 class="title">You response has been recorded, thanks!</h1>
        <p class="subtitle">
            If you have any questions, please email us at <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>, and if anything changes please RSVP again.
        </p>

        <template v-if="isComing">
            <p class="is-size-1 has-text-centered">٩(^ᴗ^)۶</p>
            <p class="has-text-centered">We can't wait to see you!</p>
        </template>
        <template v-else>
            <p class="is-size-1 has-text-centered">ʘ︵ʘ</p>
            <p class="has-text-centered">We're sad you won't be able to make it.</p>
            <p class="has-text-centered" v-if="numGuests > 0">Glad that some members of your party can make it though!</p>
        </template>
        <div class="field is-grouped is-justify-content-center mt-5">
            <p class="control">
                <a href="https://blythe.radu.love" class="is-large is-primary button">Go to the main site</a>
            </p>
            <p class="control">
                <button @click="rsvp" class="is-large is-secondary button">RSVP again</button>
            </p>
        </div>
    </div>
</template>

<style scoped>
.is-grouped {
    flex-wrap: wrap;
    gap: 0.5em 0;
}

/* TODO: these aren't being applied.. */
#app {
    height: 100%;
}
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>

<style scoped>
.thanks {
}
</style>