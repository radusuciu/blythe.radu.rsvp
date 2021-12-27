<script setup lang="ts">

import { ref, nextTick } from 'vue'
import Question from './Question.vue'
import { useResponseStore } from '../stores/response'


// TODO: focus on text box after clicking yes
// TODO: take a second look at formatting of the question/answer (color, italics etc)

defineProps({
    promptText: {
        type: String,
        default: 'Do you have any dietary restrictions?',
    },
    cssClass: {
        type: String,
        required: false,
    },
    questionTextClass: {
        type: String,
        required: false,
    },
    answerButtonsClass: {
        type: String,
        required: false,
    }
})

const showTextbox = ref(false)
const restrictionsInput = ref<null | { focus: () => null }>(null)
const responseStore = useResponseStore()

function onYes() {
    showTextbox.value = true
    console.log(restrictionsInput.value)
    nextTick(() => console.log(restrictionsInput.value))
    nextTick(() => {
        // I don't fully understand the need for setTimeout here, but
        // without it, the ref is undefined.. maybe has something to do with
        // the use of an transition
        setTimeout(() => restrictionsInput.value?.focus(), 250)
    })
}

function onRestrictionsChange(event: Event) {
    const target = event.target as HTMLInputElement
    responseStore.dietaryRestrictions = target.value
}
</script>

<template>
    <transition name="fade" mode="out-in">
        <Question
            v-if="!showTextbox"
            :class="cssClass"
            :question-class="questionTextClass"
            :answer-buttons-class="answerButtonsClass"
            :question="promptText"
            @yes="onYes"
        />
        <div v-else>
            <p>Please note any dietary restrictions and we'll do our best to accomodate you.</p>
            <textarea ref="restrictionsInput" @change="onRestrictionsChange" class="textarea is-size-5 mt-2" rows="1"></textarea>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
