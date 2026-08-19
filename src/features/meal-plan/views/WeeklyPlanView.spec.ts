import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import WeeklyPlanView from '@/features/meal-plan/views/WeeklyPlanView.vue'

describe('WeeklyPlanView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('supports adding and removing a meal from the weekly plan', async () => {
    const wrapper = mount(WeeklyPlanView)

    await wrapper.get('input[name="name"]').setValue('Crema de calabaza')
    await wrapper.get('select[name="day"]').setValue('wednesday')
    await wrapper.get('select[name="category"]').setValue('dinner')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('.meal-count strong').text()).toBe('1')
    expect(wrapper.text()).toContain('Crema de calabaza')
    expect(wrapper.text()).toContain('Cena')

    await wrapper.get('button[aria-label="Eliminar Crema de calabaza"]').trigger('click')

    expect(wrapper.get('.meal-count strong').text()).toBe('0')
    expect(wrapper.find('button[aria-label="Eliminar Crema de calabaza"]').exists()).toBe(false)
  })
})
