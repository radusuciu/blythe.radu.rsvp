<script setup lang="ts">

import { nextTick, ref, computed, toRefs } from 'vue'
import Question from './Question.vue'
import DietaryRestrictions from './DietaryRestrictions.vue'
import ResponseHeader from './ResponseHeader.vue'
import SubmitReponseButton from './SubmitResponseButton.vue'
import { useGuest } from '../composables/useGuest'
import { useResponseStore } from '../stores/response'
import { useYass } from '../composables/useYass'

// TODO: make guest plus one name required
const { guest, responseSelected, guestIsComing, guestIsNotComing } = toRefs(useGuest())
const responseStore = useResponseStore()

const guestHasPlusOne = ref(false)
const plusOneNameInput = ref<null | { focus: () => null }>(null)
const plusOneName = ref('')

const yass = useYass()

const dietaryRestrictionsText = computed(() => {
    if (guestHasPlusOne.value) {
        return 'Do you or your plus one have any dietary restrictions?'
    }
})

function onGuestHasPlusOne(event: MouseEvent) {
    guestHasPlusOne.value = true
    responseStore.responses[0].isBringingPlusOne = true
    nextTick(() => plusOneNameInput.value?.focus())
    yass(event)
}

function onGuestDoesNotHavePlusOne() {
    guestHasPlusOne.value = false
    responseStore.responses[0].isBringingPlusOne = false
}

function updatePlusOneName() {
    const response = responseStore.responses[0]

    if (guestHasPlusOne.value) {
        response.plusOneName = plusOneName.value
    } else {
        response.plusOneName = ''
    }
}
</script>

<template>
    <div>
        <ResponseHeader :guest-name="guest.name" />

        <div class="box" :class="{ 'is-loading': responseStore.isLoading }">
            <Question
                class="columns"
                question="Are you able to make it?"
                question-class="column"
                answer-buttons-class="column"
                @yes="guestIsComing(guest.id, $event)"
                @no="guestIsNotComing(guest.id); guestHasPlusOne = false"
            />
            <Question
                v-if="!responseSelected || responseStore.isMainGuestComing"
                class="columns"
                question="Will you be bringing a plus one?"
                question-class="column"
                answer-buttons-class="column"
                @yes="onGuestHasPlusOne($event)"
                @no="onGuestDoesNotHavePlusOne"
            />
            <transition name="fade">
                <div v-if="guestHasPlusOne && (responseSelected && responseStore.isMainGuestComing)" class="columns is-vcentered">
                    <span class="column mr-4">What is the name of your plus one?</span>
                    <span class="column">
                        <input ref="plusOneNameInput" v-model="plusOneName" class="input" type="text" autocomplete="off" autocorrect="off" required>
                    </span>
                </div>
            </transition>
            <template v-if="responseSelected && responseStore.isMainGuestComing">
                <hr>
                <DietaryRestrictions
                    :prompt-text="dietaryRestrictionsText"
                    answer-buttons-class="is-inline-flex"
                    css-class="has-text-centered is-italic"
                />
            </template>
        </div>

        <SubmitReponseButton
            class="is-pulled-right"
            :onBeforeSend="updatePlusOneName"
            :disabled="!responseSelected"
        />
    </div>
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