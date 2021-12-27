<script setup lang="ts">

import { ref } from 'vue'

const coming = ref(false)

defineProps({
    name: {
        type: String,
        required: true,
    }
})

defineEmits(['yes', 'no'])

</script>

<template>
    <div>
 
        <div class="column has-text-right">
           <span class="mr-4" style="vertical-align: middle">
               <span>{{ name }}</span>
           </span>
        </div>

        <div class="column">
           <div class="control is-inline is-size-5" style="vertical-align: middle;">
               <label class="radio">
                   <input type="radio">
                   Yes
               </label>
               <label class="radio ml-5">
                   <input type="radio">
                   No
               </label>
           </div>
        </div>

        <!-- <span class="buttons is-inline">
            <button
                @click="$emit('yes'); coming = true"
                class="button is-active is-success"
                :class="[ coming ? 'is-active' : 'is-outlined' ]"
            >
                Coming{{ coming ? ' 😃' : '!' }}
            </button>
            <button
                @click="$emit('no'); coming = false"
                class="button is-danger"
                :class="[ !coming ? 'is-active' : 'is-outlined' ]"
            >
                Can't make it {{ !coming ? '😢' : '' }}
            </button>
        </span> -->
    </div>
</template>
