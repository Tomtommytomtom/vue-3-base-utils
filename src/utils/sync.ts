import { computed,watch,ref,Ref } from "vue"

export const syncPropWatch = <T>(prop: () => T,emit: (eventName: string, payload: T) => void, eventName="update:modelValue") => {
    const syncedProp = ref(prop()) as Ref<T>
    watch(prop, () => {
        syncedProp.value = prop()
    })
    watch(syncedProp, () => {
        emit(eventName,syncedProp.value)
    })
    return syncedProp
}

export const syncPropComputed = <T>(prop: () => T,emit: (eventName: string, payload: T) => void, eventName="update:modelValue") => {
    return computed({
        get: () => {
            return prop()
        },
        set: newValue => {
            emit(eventName,newValue)
        }
    })
}