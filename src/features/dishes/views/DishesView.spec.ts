import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'

import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import DishesView from '@/features/dishes/views/DishesView.vue'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('DishesView', () => {
  afterEach(() => document.body.replaceChildren())

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

  it('filters dishes using title or description', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = mount(DishesView, {
      global: {
        plugins: [pinia],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })

    await wrapper.get('input[type="search"]').setValue('jengibre')

    expect(wrapper.text()).toContain('No encontramos comidas')
    await wrapper.get('input[type="search"]').setValue('albahaca')
    expect(wrapper.text()).toContain('Pasta al pesto')
    expect(wrapper.text()).not.toContain('Tortilla de patatas')
  })

  it('removes a dish from the catalog, plan and favorites after confirmation', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dishesStore = useDishesStore()
    const favoritesStore = useFavoritesStore()
    const mealPlanStore = useMealPlanStore()
    mealPlanStore.scheduleDish('dish-tortilla-patatas', 'monday')
    favoritesStore.toggleFavorite('dish-tortilla-patatas')
    const wrapper = mount(DishesView, {
      attachTo: document.body,
      global: {
        plugins: [pinia],
        stubs: { RouterLink: { template: '<a><slot /></a>' } },
      },
    })

    await wrapper.get('button[aria-label="Eliminar Tortilla de patatas"]').trigger('click')
    document.querySelector<HTMLButtonElement>('.confirmation-modal__confirm')?.click()
    await wrapper.vm.$nextTick()

    expect(dishesStore.dishes.some(({ id }) => id === 'dish-tortilla-patatas')).toBe(false)
    expect(mealPlanStore.plannedMeals).toEqual([])
    expect(favoritesStore.isFavorite('Tortilla de patatas', 'dish-tortilla-patatas')).toBe(false)
    wrapper.unmount()
  })
})
