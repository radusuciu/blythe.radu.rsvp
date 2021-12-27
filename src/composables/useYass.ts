import { confetti } from 'party-js'


export function useYass() {
    function yass(event: Event) {
        confetti(event.target as HTMLElement)
    }

    return yass
}
