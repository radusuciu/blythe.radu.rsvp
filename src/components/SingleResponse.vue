<script setup lang="ts">

import { toRefs } from 'vue'
import DietaryRestrictions from './DietaryRestrictions.vue'
import Question from './Question.vue'
import ResponseHeader from './ResponseHeader.vue'
import SubmitReponseButton from './SubmitResponseButton.vue'
import { useGuest } from '../composables/useGuest'
import { useResponseStore } from '../stores/response'


const responseStore = useResponseStore()

const {
    guest,
    responseSelected,
    guestIsComing,
    guestIsNotComing,
} = toRefs(useGuest())

</script>

<template>
    <div>
        <ResponseHeader :guest-name="guest.name" />

        <div class="box" :class="{ 'is-loading': responseStore.isLoading }">
            <Question
                class="columns"
                question="Are you able to make it?"
                question-class="column"
                answer-buttons-class="is-inline column"
                @yes="guestIsComing(guest.id, $event)"
                @no="guestIsNotComing(guest.id)"
            />
            <DietaryRestrictions
                v-if="responseSelected && responseStore.isMainGuestComing"
                css-class="columns"
                question-text-class="column"
                answer-buttons-class="is-inline column"
            />
        </div>

        <SubmitReponseButton class="is-pulled-right" :disabled="!responseSelected" />
    </div>
</template>
