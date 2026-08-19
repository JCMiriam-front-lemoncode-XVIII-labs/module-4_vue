import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToastStore } from '@/common/stores/toast.store'

describe('useToastStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('adds and automatically removes a toast', () => {
    const store = useToastStore()

    store.showToast('Cambios guardados.', 'success', 1000)
    expect(store.toasts).toEqual([
      expect.objectContaining({ message: 'Cambios guardados.', variant: 'success' }),
    ])

    vi.advanceTimersByTime(1000)
    expect(store.toasts).toEqual([])
  })

  it('keeps at most four visible messages', () => {
    const store = useToastStore()
    for (let index = 1; index <= 5; index += 1) store.showToast(`Mensaje ${index}`)

    expect(store.toasts).toHaveLength(4)
    expect(store.toasts.some(({ message }) => message === 'Mensaje 1')).toBe(false)
  })
})
