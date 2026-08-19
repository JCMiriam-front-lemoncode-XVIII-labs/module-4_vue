import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import ConfirmationModal from '@/common/components/confirmation-modal/ConfirmationModal.vue'

describe('ConfirmationModal', () => {
  afterEach(() => document.body.replaceChildren())

  it('emits confirm from its primary action', async () => {
    const wrapper = mount(ConfirmationModal, {
      attachTo: document.body,
      props: {
        open: true,
        title: '¿Vaciar el plan?',
        description: 'Esta acción elimina la planificación.',
        confirmLabel: 'Vaciar',
      },
    })

    const confirmButton = document.querySelector<HTMLButtonElement>('.confirmation-modal__confirm')
    confirmButton?.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('emits cancel when Escape is pressed', async () => {
    const wrapper = mount(ConfirmationModal, {
      props: { open: true, title: 'Título', description: 'Descripción' },
    })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('cancel')).toHaveLength(1)
    wrapper.unmount()
  })
})
