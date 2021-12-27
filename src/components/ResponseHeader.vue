<script lang="ts" setup>
defineProps({
    guestName: {
        type: String,
        required: true,
    },
    subtitleExtra: {
        type: String,
        default: '',
    }
})
</script>

<template>
    <h1 class="title">
        Hi <strong class="has-text-info">{{ guestName }}</strong>! <router-link :to="{ name: 'home' }" style="vertical-align:top" class="is-size-6 has-text-grey-light is-clickable">(not you?)</router-link>
    </h1>
    <p class="subtitle">
        Would you please tell us if you're able to make it? {{ subtitleExtra }}If you encounter any issues or have questions, please email us at <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>.
    </p>
</template>
