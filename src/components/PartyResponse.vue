<script setup lang="ts">

import { computed, toRefs } from 'vue'
import AttendanceQuestionRow from './AttendanceQuestionRow.vue'
import DietaryRestrictions from './DietaryRestrictions.vue'
import { useGuest } from '../composables/useGuest'
import ResponseHeader from './ResponseHeader.vue'
import { useResponseStore } from '../stores/response'
import SubmitReponseButton from './SubmitResponseButton.vue'

// TODO: currently party members are marked as not coming even if there is no answer
// because of how the responses are initialized
const { guest, responseSelected, guestIsComing, guestIsNotComing } = toRefs(useGuest())
const responseStore = useResponseStore()

const party = computed(() => {
    return [guest.value, ...guest.value.party]
})
</script>

<template>
    <div>
        <ResponseHeader
            :guest-name="guest.name"
            subtitleExtra="You may also answer for others in your party. "
        />

        <div class="box" :class="{ 'is-loading': responseStore.isLoading }">
            <table class="table container">
                <thead>
                    <tr>
                        <th>Guest Name</th>
                        <th colspan="2" class="has-text-centered">Are they coming?</th>
                    </tr>
                </thead>
                <tbody>
                    <AttendanceQuestionRow 
                        v-for="g in party"
                        :name="g.name"
                        @yes="guestIsComing(g.id, $event)"
                        @no="guestIsNotComing(g.id)"
                    />
                </tbody>
            </table>
            <DietaryRestrictions
                css-class="has-text-centered is-italic"
                answer-buttons-class="is-block-mobile is-inline-flex-tablet"
            />
        </div>

        <SubmitReponseButton class="is-pulled-right" :disabled="!responseSelected" />
    </div>
</template>
