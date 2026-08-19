import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import ToastContainer from '@/common/components/toast-container/ToastContainer.vue'
import { useToastStore } from '@/common/stores/toast.store'

describe('ToastContainer', () => {
  afterEach(() => document.body.replaceChildren())

  it('renders and manually closes notifications', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useToastStore()
    const wrapper = mount(ToastContainer, { global: { plugins: [pinia] } })
    store.showToast('Menú descargado.', 'success', 10_000)
    await wrapper.vm.$nextTick()

    expect(document.body.textContent).toContain('Menú descargado.')
    document.querySelector<HTMLButtonElement>('button[aria-label="Cerrar notificación"]')?.click()
    await wrapper.vm.$nextTick()

    expect(store.toasts).toEqual([])
    wrapper.unmount()
  })
})
