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

  it('updates a meal and moves it to another day', () => {
    const store = useMealPlanStore()
    const meal = store.addMeal({ name: 'Pasta', day: 'monday', category: 'lunch' })

    store.updateMeal(meal.id, { name: 'Pasta al pesto', day: 'thursday', category: 'dinner' })

    expect(store.meals[0]).toMatchObject({
      name: 'Pasta al pesto',
      day: 'thursday',
      category: 'dinner',
    })
    expect(store.mealsByDay.monday).toEqual([])
    expect(store.mealsByDay.thursday).toHaveLength(1)
  })

  it('does not duplicate the same meal on the same day', () => {
    const store = useMealPlanStore()

    store.addMeal({ name: 'Tortilla', day: 'monday', category: 'dinner' })
    store.addMeal({ name: 'tortilla', day: 'monday', category: 'dinner' })

    expect(store.meals).toHaveLength(1)
  })

  it('rejects a meal with an empty name', () => {
    const store = useMealPlanStore()

    expect(() => store.addMeal({ name: '   ', day: 'sunday', category: 'breakfast' })).toThrowError(
      'El nombre del plato es obligatorio',
    )
    expect(store.meals).toEqual([])
  })

  it('clears every planned meal without deleting its dishes', () => {
    const store = useMealPlanStore()
    store.addMeal({ name: 'Gazpacho', day: 'monday', category: 'lunch' })
    store.addMeal({ name: 'Pizza', day: 'friday', category: 'dinner' })

    store.clearPlan()

    expect(store.meals).toEqual([])
    expect(store.mealCount).toBe(0)
  })
})
