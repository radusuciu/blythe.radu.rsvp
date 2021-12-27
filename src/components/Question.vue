<script setup lang="ts">

import { ref } from 'vue'


defineProps({
    question: {
        type: String,
        required: true,
    },
    questionClass: {
        type: String,
        required: false,
    },
    answerButtonsClass: {
        type: String,
        required: false,
    }
})

const emit = defineEmits(['yes', 'no'])

const answered = ref(false)
const answeredYes = ref(false)
const answeredNo = ref(false)

function yes(event: MouseEvent) {
    answered.value = true
    answeredYes.value = true
    answeredNo.value = false
    emit('yes', event)
}

function no() {
    answered.value = true
    answeredNo.value = true
    answeredYes.value = false
    emit('no')
}


</script>

<template>
    <div>
        <span class="mr-4" :class="questionClass" style="vertical-align: middle">
            {{ question }}
        </span>
        <span class="buttons is-inline" :class="answerButtonsClass">
            <button @click="yes($event)" :class="answeredYes ? 'is-active': 'is-outlined'" class="button is-success">Yes</button>
            <button @click="no" :class="answeredNo ? 'is-active': 'is-outlined'" class="button is-danger">No</button>
        </span>
    </div>
</template>
