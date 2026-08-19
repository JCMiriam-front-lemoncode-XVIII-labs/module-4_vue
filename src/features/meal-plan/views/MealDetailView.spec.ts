import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import MealDetailView from '@/features/meal-plan/views/MealDetailView.vue'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('MealDetailView', () => {
  it('saves a new dish without adding it to the weekly plan', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const dishesStore = useDishesStore()
    const mealPlanStore = useMealPlanStore()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/meals/new', name: 'meal-create', component: MealDetailView },
        { path: '/dishes/:id', name: 'dish-detail', component: MealDetailView },
      ],
    })
    await router.push('/meals/new')
    await router.isReady()
    const wrapper = mount(MealDetailView, { global: { plugins: [pinia, router] } })

    await wrapper.get('input[name="detail-name"]').setValue('Ensalada de quinoa')
    await wrapper.get('textarea[name="detail-description"]').setValue('Con tomate y aguacate')
    const saveButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Guardar sin planificar'))
    await saveButton?.trigger('click')

    const createdDish = dishesStore.dishes.find(({ name }) => name === 'Ensalada de quinoa')
    expect(createdDish?.description).toBe('Con tomate y aguacate')
    expect(mealPlanStore.meals.some(({ dishId }) => dishId === createdDish?.id)).toBe(false)
  })

  it('edits and repeats a meal on several days', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useMealPlanStore()
    const meal = store.addMeal({
      name: 'Pasta',
      description: 'Con tomate',
      day: 'monday',
      category: 'lunch',
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div />' } },
        { path: '/meals/:id', component: MealDetailView },
      ],
    })
    await router.push(`/meals/${meal.id}`)
    await router.isReady()
    const wrapper = mount(MealDetailView, { global: { plugins: [pinia, router] } })

    await wrapper.get('input[name="detail-name"]').setValue('Pasta al pesto')
    await wrapper.get('textarea[name="detail-description"]').setValue('Con albahaca fresca')
    const checkboxes = wrapper.findAll<HTMLInputElement>('input[type="checkbox"]')
    await checkboxes[1]?.setValue(true)
    await checkboxes[2]?.setValue(true)
    await wrapper.get('form').trigger('submit')

    expect(store.meals).toHaveLength(3)
    expect(store.meals.map(({ day }) => day)).toEqual(
      expect.arrayContaining(['monday', 'tuesday', 'wednesday']),
    )
    expect(store.meals.every(({ name }) => name === 'Pasta al pesto')).toBe(true)
  })
})
