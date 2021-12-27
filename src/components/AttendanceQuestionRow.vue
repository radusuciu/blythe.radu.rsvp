<script setup lang="ts">

import { ref, computed } from 'vue'

const props = defineProps({
    name: {
        type: String,
        required: true,
    }
})

const coming = ref(null)

const nameSlug = computed(() => {
    return props.name.toLowerCase().replace(' ', '-')
})


</script>

<template>
    <tr>
        <td>
            <span :class="{'has-text-success': coming === true, 'has-text-grey': coming === false }">
                {{ name }}
            </span>
        </td>
        <td>
            <div class="control is-size-5">
                <label class="radio">
                    <input @click="$emit('yes', $event)" :name="nameSlug" type="radio" :value="true" v-model="coming">
                    Yes
                </label>
            </div>
        </td>
        <td>
            <div class="control is-size-5">
                <label class="radio">
                    <input @click="$emit('no')" :name="nameSlug" type="radio" :value="false" v-model="coming">
                    No
                </label>
            </div>
        </td>
    </tr>
</template>
