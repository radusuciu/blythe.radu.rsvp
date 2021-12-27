<script setup lang="ts">

defineProps({
    name: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    }
})

defineEmits(['yes', 'no'])
</script>

<template>
    <span>
        <span class="mr-4" style="vertical-align: middle" :class="{ 'has-text-grey-light': disabled }">
            <span>Is this you:</span> <span class="has-text-weight-bold" :class="{ 'has-text-info': !disabled }">{{ name }}</span>?
        </span>
        <span class="buttons is-inline">
            <button @click="$emit('yes')" class="button is-outlined is-success" :disabled="disabled">Yes</button>
            <button @click="$emit('no')" class="button is-outlined is-danger" :disabled="disabled">No</button>
        </span>
    </span>
</template>
