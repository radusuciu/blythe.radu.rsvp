// modeled after example:
// https://github.com/posva/pinia/blob/75430315d2dc704ecd3f3e1f169b0dd1d39e3c11/packages/playground/src/stores/nasa-pod.ts

import { ref, watch } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { getGuest } from '../api/guest'
import { useCachedRequest } from '../composables/useCachedRequest'


export const useGuestStore = defineStore('guest', () => {
    const guestId = ref<string>('')

    watch(guestId, (guestId, previousGuestId) => {
        console.log('guestId changed', guestId)
        console.log(guestId, previousGuestId)
        // only fetch new guest if this at initialization
        // since that is already handled
        if (guestId) {
            fetchGuest(guestId)
        }
    })
    // TODO re-consider use of cached request here
    console.log('set up store', guestId.value)

    const {
        data: guest,
        error,
        isLoading,
        isReady,
    } = useCachedRequest(guestId, getGuest)

    function fetchGuest(guestId: string) {
        console.log('getting guest')
        error.value = undefined
        isLoading.value = true

        return getGuest(guestId)
            .then((guestData) => {
                console.log('success', guestData)
                guest.value = guestData
            })
            .catch((err) => {
                error.value = err
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    function clear() {
        guestId.value = ''
        guest.value = undefined
        error.value = undefined
        isLoading.value = false
        isReady.value = false
    }

    return {
        guestId,
        guest,
        error,
        isReady,
        isLoading,
        clear,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useGuestStore, import.meta.hot))
}
