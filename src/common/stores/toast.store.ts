import { ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: string
  message: string
  variant: ToastVariant
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])
  const timers = new Map<string, ReturnType<typeof setTimeout>>()

  const removeToast = (toastId: string): void => {
    const timer = timers.get(toastId)
    if (timer) clearTimeout(timer)
    timers.delete(toastId)
    toasts.value = toasts.value.filter(({ id }) => id !== toastId)
  }

  const showToast = (
    message: string,
    variant: ToastVariant = 'success',
    duration = 3500,
  ): string => {
    const id = crypto.randomUUID()
    toasts.value.push({ id, message, variant })
    if (toasts.value.length > 4) removeToast(toasts.value[0]?.id ?? '')
    timers.set(
      id,
      setTimeout(() => removeToast(id), duration),
    )
    return id
  }

  return { toasts, showToast, removeToast }
})
