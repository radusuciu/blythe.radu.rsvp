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
                answer-buttons-class="is-inline-flex"
            />
        </div>

        <SubmitReponseButton class="is-pulled-right" :disabled="!responseSelected" />
    </div>
</template>

<style lang="scss" scoped>
@import "../node_modules/bulma/bulma.sass";
@import "../node_modules/bulma/sass/utilities/initial-variables";
@import "../node_modules/bulma/sass/utilities/derived-variables";

div {
    &.is-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.5;
        &:after {
            @include loader;
            position: absolute;
            top: calc(50% - 2.5em);
            left: calc(50% - 2.5em);
            width: 5em;
            height: 5em;
            border-width: 0.25em;
        }
    }
}
</style>
