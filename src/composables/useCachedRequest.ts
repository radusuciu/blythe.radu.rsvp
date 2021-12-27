// from https://github.com/posva/pinia/blob/75430315d2dc704ecd3f3e1f169b0dd1d39e3c11/packages/playground/src/composables/useCachedRequest.ts

import { unref, ref, watchEffect, Ref, onScopeDispose } from 'vue'

export function useCachedRequest<T, U>(
    keySource: Ref<U>,
    getter: (key: U) => Promise<T>
) {
    const data = ref<T>()
    const isLoading = ref(false)
    const isReady = ref(false)
    const error = ref<Error | undefined>()

    const cache = new Map<U, T>()

    onScopeDispose(() => {
        cache.clear()
    })

    // TODO: maybe use watch instead to avoid immediate execution?
    watchEffect(async () => {
        const key = unref(keySource)

        if (!key) {
            return Promise.resolve()
        }

        isReady.value = false
        isLoading.value = true

        if (cache.has(key)) {
            console.log('cache has key')
            data.value = cache.get(key)!
            isReady.value = true
        }

        getter(key)
            .then((newData) => {
                cache.set(key, newData)
                data.value = newData
                error.value = undefined
                isReady.value = true
            })
            .catch((err) => {
                error.value = err
            })
            .finally(() => {
                isLoading.value = false
            })
    })

    return { data, error, isLoading, isReady }
}