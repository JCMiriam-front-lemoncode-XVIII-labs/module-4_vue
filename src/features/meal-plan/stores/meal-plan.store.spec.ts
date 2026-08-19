import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('useMealPlanStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds and groups a meal by day', () => {
    const store = useMealPlanStore()

    const meal = store.addMeal({
      name: '  Lentejas con verduras  ',
      day: 'monday',
      category: 'lunch',
    })

    expect(meal.name).toBe('Lentejas con verduras')
    expect(store.mealCount).toBe(1)
    expect(store.mealsByDay.monday).toEqual([meal])
    expect(store.mealsByDay.tuesday).toEqual([])
  })

  it('removes a meal without modifying the others', () => {
    const store = useMealPlanStore()
    const mondayMeal = store.addMeal({ name: 'Gazpacho', day: 'monday', category: 'lunch' })
    const fridayMeal = store.addMeal({ name: 'Pizza', day: 'friday', category: 'dinner' })

    store.removeMeal(mondayMeal.id)

    expect(store.meals).toEqual([fridayMeal])
    expect(store.mealCount).toBe(1)
  })

  it('rejects a meal with an empty name', () => {
    const store = useMealPlanStore()

    expect(() => store.addMeal({ name: '   ', day: 'sunday', category: 'breakfast' })).toThrowError(
      'El nombre del plato es obligatorio',
    )
    expect(store.meals).toEqual([])
  })
})
