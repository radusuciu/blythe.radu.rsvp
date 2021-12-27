import { ref, watch } from 'vue'
import { useGuestStore } from '../stores/guest'
import { useResponseStore } from '../stores/response'
import { Guest } from '../api/guest'
import { storeToRefs } from 'pinia'
import { useYass } from '../composables/useYass'


export function useGuest() {
    const guestStore = useGuestStore()
    const { guest } = storeToRefs(guestStore)
    const responseSelected = ref(false)
    const responseStore = useResponseStore()
    const yass = useYass()

    watch(guest, (guest: Guest) => {
        if (guest) {
            responseStore.clear()
            responseStore.initializeGuest(guest)
            if (guest.hasOwnProperty('party')) {
                guest.party.map(responseStore.initializeGuest)
            } 
        }

    }, { immediate: true })

    function guestIsComing(guestId: string, event?: Event) {
        responseSelected.value = true

        responseStore.respond({
            id: guestId,
            isComing: true,
            responseBy: guest.value.id,
        })

        if (event) {
            yass(event)
        }
    }

    function guestIsNotComing(guestId: string) {
        responseSelected.value = true

        responseStore.respond({
            id: guestId,
            isComing: false,
            responseBy: guest.value.id,
        })
    }

    return {
        guest,
        responseSelected,
        guestIsComing,
        guestIsNotComing,
    }
}
