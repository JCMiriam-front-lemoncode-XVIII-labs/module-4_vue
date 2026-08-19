import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DishesView from '@/features/dishes/views/DishesView.vue'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('DishesView', () => {
  it('renders mock dishes and their planned day count', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const mealPlanStore = useMealPlanStore()
    mealPlanStore.scheduleDish('dish-tortilla-patatas', 'monday')

    const wrapper = mount(DishesView, {
      global: {
        plugins: [pinia],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })

    expect(wrapper.text()).toContain('Tortilla de patatas')
    expect(wrapper.text()).toContain('Tortilla jugosa')
    expect(wrapper.text()).toContain('1 día planificado')
  })
})
