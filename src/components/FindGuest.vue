<script setup lang="ts">

import { ref, onMounted, computed, watch } from 'vue'
import { useCachedRequest } from '../composables/useCachedRequest'
import { findGuest } from '../api/guest'
import IdentityQuestion from '@/components/IdentityQuestion.vue'
import WrongGuest from '@/components/WrongGuest.vue'
import { useDebounce } from '@vueuse/core'
import { watchOnce } from '@vueuse/core'


const emit = defineEmits(['rightGuest', 'wrongGuest'])

const searchInput = ref<null | { focus: () => null }>(null)
const searchTerm = ref('')
const wrongGuest = ref(false)
const debouncedTerm = useDebounce(searchTerm, 300)

const {
    data,
    error,
    isLoading,
    isReady,
} = useCachedRequest(debouncedTerm, findGuest)

const debouncedIsLoading = useDebounce(isLoading, 300)
// const debouncedIsLoading = isLoading.value
const trimmedTerm = computed(() => searchTerm.value.trim())
const termLength = computed(() => trimmedTerm.value.length)

const isExactMatch = computed(() => {
    return error.value === undefined && data.value && data.value.guest && data.value.uniqueMatch
})

const isMultipleMatches = computed(() => {
    return error.value === undefined && !data.value?.uniqueMatch && termLength.value > 4 && data.value?.matches?.length
})

const keepTyping = computed(() => {
    return error.value === undefined && !data.value?.uniqueMatch && termLength.value > 2
})

const noMatches = computed(() => {
    return error.value && !debouncedIsLoading.value && termLength.value > 2
})


function onWrongGuest() {
    emit('wrongGuest')
    wrongGuest.value = true
    searchInput.value?.focus()
    watchOnce(debouncedTerm, () => wrongGuest.value = false)
}

onMounted(() => {
    searchInput.value?.focus()
})

</script>

<template>
    <div>
        <h1 class="title">Hello lovely guest</h1>
        <p class="subtitle">Thank you for responding!</p>
        <div class="block">
            <p>First, let's find your invite, could we please have your name?</p>
            <div class="control is-medium" :class="{ 'is-loading': debouncedIsLoading }">
                <input ref="searchInput" autofocus type="text" maxlength="100"
                    class="input is-primary is-medium"
                    placeholder="Just start typing!"
                    v-model="searchTerm"
                >
            </div>
            <transition name="fade">
                <p v-show="debouncedIsLoading" class="is-pulled-right has-text-right is-size-6 is-italic has-text-grey">
                    loading
                </p>
            </transition>
        </div>
        <div class="block" v-if="termLength">
            <transition name="fade" mode="out-in">
                <WrongGuest v-if="wrongGuest" />
                <IdentityQuestion
                    v-else-if="isExactMatch"
                    :disabled="debouncedIsLoading"
                    :name="data?.guest?.name"
                    :key="data!.guest!.id"
                    @yes="$emit('rightGuest', data?.guest)"
                    @no="onWrongGuest"
                />
                <div class="notification is-info is-light" v-else-if="isMultipleMatches">
                    There are multiple guests matching the name <strong>{{ trimmedTerm }}</strong>, please keep typing if you can, or select yourself below:

                    <div class="block field is-grouped mt-2">
                        <span class="control" v-for="guest in data?.matches" :key="guest.id">
                            <button @click="$emit('rightGuest', guest)" class="button is-multiline is-link is-outlined">
                                <strong>{{ guest.name }}</strong>
                                <div v-if="guest.party" v-for="partyGuest in guest.party" :key="partyGuest.id">
                                    + {{ partyGuest.name }}
                                </div>
                            </button>
                        </span>
                        <span class="control">
                            <button class="button is-danger is-outlined is-multiline" @click="onWrongGuest">None of these are me</button>
                        </span>
                    </div>
                </div>
                <div class="notification is-info is-light" v-else-if="keepTyping">
                    We could not find a good enough match for: <strong>{{ trimmedTerm }}</strong>, please keep typing.
                    <p class="control has-text-centered mt-2" v-if="termLength > 4">
                        <button class="button is-danger is-outlined" @click="onWrongGuest">I can't find myself!</button>
                    </p>
                </div>
                <div class="notification is-danger is-light" v-else-if="noMatches">
                    We couldn't find a guest matching the name <strong>{{ trimmedTerm }}</strong>. Please contact us at the following email and we'll figure it out: <a href="mailto:rsvp@blythe.radu.love">rsvp@blythe.radu.love</a>.
                </div>
            </transition>
        </div>
    </div>
</template>

<style scoped>
.is-grouped {
    flex-wrap: wrap;
    gap: 0.5em 0;
}

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