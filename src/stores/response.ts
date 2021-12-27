import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { recordResponse, GuestResponse, Guest } from '../api/guest'

export const useResponseStore = defineStore('response', () => {

    const data = ref<object>()
    const isLoading = ref(false)
    const isReady = ref(false)
    const error = ref<Error | undefined>()

    const responses = ref<GuestResponse[]>([])
    const dietaryRestrictions = ref('')

    function send() {
        error.value = undefined
        isLoading.value = true

        const responsesData = responses.value
            .map(r => {
                if (r.isComing === true) {
                    r.dietaryRestrictions = dietaryRestrictions.value
                }
                return r
            })
            .filter(r => r.isComing !== undefined)
        
        return recordResponse(responsesData).then((newData) => {
            data.value = newData as object
            error.value = undefined
            isReady.value = true
        })
        .catch((err) => {
            error.value = err
        })
        .finally(() => {
            isLoading.value = false
        })
    }

    const isMainGuestComing = computed(() => {
        const mainGuest = responses.value.find(r => r.responseBy === r.id)

        if (mainGuest) {
            return mainGuest.isComing
        }

        return false
    })

    const numGuestsComing = computed(() => {
        return responses.value.filter(r => r.isComing === true).length
    })

    function initializeGuest(guest: Guest) {
        responses.value = [
            ...responses.value.filter(r => r.id !== guest.id),
            { id: guest.id, isComing: undefined },
        ]
    }

    function respond(response: GuestResponse) {
        responses.value = [
            ...responses.value.filter(r => r.id !== response.id),
            response
        ]
    }

    function clear() {
        responses.value = []
        dietaryRestrictions.value = ''
    }

    return {
        data,
        isLoading,
        isReady,
        error,
        responses,
        dietaryRestrictions,
        isMainGuestComing,
        numGuestsComing,
        clear,
        respond,
        initializeGuest,
        send,
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useResponseStore, import.meta.hot))
}
