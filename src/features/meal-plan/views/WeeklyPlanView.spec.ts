import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import WeeklyPlanView from '@/features/meal-plan/views/WeeklyPlanView.vue'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('WeeklyPlanView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('supports adding and removing a meal from the weekly plan', async () => {
    const store = useMealPlanStore()
    store.addMeal({ name: 'Crema de calabaza', day: 'wednesday', category: 'dinner' })
    const wrapper = mount(WeeklyPlanView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    expect(wrapper.get('.meal-count strong').text()).toBe('1')
    expect(wrapper.text()).toContain('Crema de calabaza')
    expect(wrapper.text()).toContain('Cena')

    await wrapper
      .get('button[aria-label="Guardar Crema de calabaza en favoritos"]')
      .trigger('click')

    expect(useFavoritesStore().favorites[0]).toMatchObject({
      name: 'Crema de calabaza',
      defaultCategory: 'dinner',
    })
    expect(
      wrapper.get('button[aria-label="Crema de calabaza está en favoritos"]').classes(),
    ).toContain('meal-item__favorite--active')

    await wrapper.get('button[aria-label="Eliminar Crema de calabaza"]').trigger('click')

    expect(wrapper.get('.meal-count strong').text()).toBe('0')
    expect(wrapper.find('button[aria-label="Eliminar Crema de calabaza"]').exists()).toBe(false)
  })

  it('filters planned meals by name, category and day', async () => {
    const store = useMealPlanStore()
    store.addMeal({ name: 'Pasta', day: 'monday', category: 'lunch' })
    store.addMeal({ name: 'Sopa', day: 'friday', category: 'dinner' })
    const wrapper = mount(WeeklyPlanView, {
      global: { stubs: { RouterLink: { template: '<a><slot /></a>' } } },
    })

    await wrapper.get('#meal-search').setValue('pasta')

    expect(wrapper.text()).toContain('Pasta')
    expect(wrapper.text()).not.toContain('Sopa')

    await wrapper.get('#meal-search').setValue('')
    await wrapper.get('#meal-category-filter').setValue('dinner')

    expect(wrapper.text()).not.toContain('Pasta')
    expect(wrapper.text()).toContain('Sopa')

    await wrapper.get('#meal-day-filter').setValue('friday')
    expect(wrapper.findAll('.day-card')).toHaveLength(1)
  })
})
