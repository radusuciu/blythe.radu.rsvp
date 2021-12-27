<script setup lang="ts">

import { ref, onMounted, computed } from 'vue'
import { useCachedRequest } from '../composables/useCachedRequest'
import { findGuest, Guest } from '../api/guest'
import IdentityQuestion from '@/components/IdentityQuestion.vue'
import { useDebounce } from '@vueuse/core'


defineEmits(['rightGuest', 'wrongGuest'])

const searchInput = ref<null | { focus: () => null }>(null)
const searchTerm = ref('')
const debouncedTerm = useDebounce(searchTerm, 200)

const {
    data,
    error,
    isLoading,
    isReady,
} = useCachedRequest(debouncedTerm, findGuest)


const exactMatch = computed(() => {
    return error.value === undefined && data.value?.uniqueMatch
})

const keepTyping = computed(() => {
    return error === undefined && !data.value?.uniqueMatch && searchTerm.value.trim().length > 2
})

const noMatches = computed(() => {
    return error && searchTerm.value.trim().length > 2
})

onMounted(() => {
    searchInput.value?.focus()
})

// TODO: if we had a unique match and the user keeps typing maybe stop making requests
// or maybe just keep that last good match up if further input makes us unable to find
// a good match

</script>

<template>
    <div>
        <h1 class="title">Hello lovely guest</h1>
        <p class="subtitle">
            Thank you for responding!
        </p>
        <div class="block">
            <p class="">
                First, let's find your invite, could we please have your name?
            </p>
            <div class="control is-medium" :class="{ 'is-loading': isLoading }">
                <input ref="searchInput" autofocus type="text"
                    class="input is-primary is-medium"
                    placeholder="Just start typing!"
                    v-model="searchTerm"
                >
            </div>
            <transition name="fade">
                <p v-show="isLoading" class="is-pulled-right has-text-right is-size-6 is-italic has-text-grey">
                    loading
                </p>
            </transition>
        </div>
        <div class="block">
            <div class="">
                <transition name="fade" mode="out-in">
                    <IdentityQuestion
                        v-if="error === undefined && data?.uniqueMatch"
                        :disabled="isLoading"
                        :name="data.guest.name"
                        @yes="$emit('rightGuest', data.guest)"
                        @no="$emit('wrongGuest')"
                    />
                    <div class="notification is-info is-light" v-else-if="error === undefined && !data?.uniqueMatch && searchTerm.trim().length > 4 && data.matches.length">
                        There are multiple guests matching the name <strong>{{ searchTerm.trim() }}</strong>, please keep typing if you can, or select yourself below:

                        <div class="block field is-grouped mt-2">
                            <span class="control" v-for="guest in data.matches" :key="guest.id">
                                <button @click="$emit('rightGuest', guest)" class="button is-multiline is-link is-outlined">
                                    <strong>{{ guest.name }}</strong>
                                    <div v-if="guest.party" v-for="partyGuest in guest.party" :key="partyGuest.id">
                                        + {{ partyGuest.name }}
                                    </div>
                                </button>
                            </span>
                            <span class="control">
                                <button class="button is-danger is-outlined is-multiline">None of these are me</button>
                            </span>
                        </div>
                    </div>
                    <div class="notification is-info is-light" v-else-if="error === undefined && !data?.uniqueMatch && searchTerm.trim().length > 2">
                        We could not find a good enough match for: <strong>{{ searchTerm.trim() }}</strong>, please keep typing.
                    </div>
                    <div class="notification is-danger is-light" v-else-if="error && searchTerm.trim().length > 2">
                        We couldn't find a guest matching the name <strong>{{ searchTerm.trim() }}</strong>. Please contact us at the following email and we'll figure it out: <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>.
                    </div>
                </transition>
            </div>
            <p class=""></p>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.button.is-multiline {
    min-height: 4em;
    white-space: unset;
    height: auto;
    flex-direction: column;
}
</style>