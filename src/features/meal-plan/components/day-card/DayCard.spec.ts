import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import DayCard from '@/features/meal-plan/components/day-card/DayCard.vue'

const monday = { value: 'monday', label: 'Lunes', shortLabel: 'Lun' } as const

describe('DayCard', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('renders its empty state', () => {
    const wrapper = mount(DayCard, {
      props: { day: monday, meals: [] },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('Lunes')
    expect(wrapper.text()).toContain('Aún no hay platos')
  })

  it('renders meals and forwards the remove event', async () => {
    const wrapper = mount(DayCard, {
      props: {
        day: monday,
        meals: [
          {
            id: 'meal-1',
            dishId: 'dish-1',
            name: 'Lentejas',
            day: 'monday',
            category: 'lunch',
            createdAt: '2026-08-19T10:00:00.000Z',
          },
        ],
      },
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.text()).toContain('Comida')
    expect(wrapper.text()).toContain('Lentejas')

    await wrapper.get('button[aria-label="Eliminar Lentejas"]').trigger('click')

    expect(wrapper.emitted('remove')).toEqual([['meal-1']])
  })
})
