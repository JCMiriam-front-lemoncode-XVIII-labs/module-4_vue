import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { WEEKDAYS } from '@/common/constants/weekdays'
import type { Dish, Meal, PlannedMeal, Weekday } from '@/common/types/meal'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import type {
  CreateMealInput,
  MealDetailsInput,
  WeeklyMeals,
} from '@/features/meal-plan/types/meal-plan'

type LegacyMeal = Omit<Meal, 'dishId'> & { dishId?: string }

const emptyWeek = (): WeeklyMeals =>
  WEEKDAYS.reduce((week, { value }) => ({ ...week, [value]: [] }), {} as WeeklyMeals)

export const useMealPlanStore = defineStore(
  'meal-plan',
  () => {
    const plannedMeals = ref<PlannedMeal[]>([])
    const legacyMeals = ref<LegacyMeal[]>([])
    const dishesStore = useDishesStore()

    const migrateLegacyMeals = (): void => {
      if (!legacyMeals.value.length) return
      for (const legacy of legacyMeals.value) {
        let dish = dishesStore.dishes.find(
          ({ name, category }) =>
            name.toLocaleLowerCase() === legacy.name.toLocaleLowerCase() &&
            category === legacy.category,
        )
        dish ??= dishesStore.addDish(legacy)
        if (!plannedMeals.value.some(({ id }) => id === legacy.id)) {
          plannedMeals.value.push({
            id: legacy.id,
            dishId: dish.id,
            day: legacy.day,
            createdAt: legacy.createdAt,
          })
        }
      }
      legacyMeals.value = []
    }

    const meals = computed<Meal[]>(() => {
      migrateLegacyMeals()
      return plannedMeals.value.flatMap((planned) => {
        const dish = dishesStore.dishes.find(({ id }) => id === planned.dishId)
        return dish
          ? [
              {
                ...planned,
                name: dish.name,
                description: dish.description,
                category: dish.category,
              },
            ]
          : []
      })
    })
    const mealCount = computed(() => plannedMeals.value.length)
    const mealsByDay = computed(() => {
      const week = emptyWeek()
      for (const meal of meals.value) week[meal.day].push(meal)
      return week
    })

    const scheduleDish = (dishId: Dish['id'], day: Weekday): PlannedMeal => {
      const existing = plannedMeals.value.find((meal) => meal.dishId === dishId && meal.day === day)
      if (existing) return existing
      const planned = { id: crypto.randomUUID(), dishId, day, createdAt: new Date().toISOString() }
      plannedMeals.value.push(planned)
      return planned
    }

    const addMeal = (input: CreateMealInput): Meal => {
      migrateLegacyMeals()
      const normalizedName = input.name.trim().toLocaleLowerCase()
      const dish = input.dishId
        ? dishesStore.dishes.find(({ id }) => id === input.dishId)
        : (dishesStore.dishes.find(
            ({ name, category }) =>
              name.toLocaleLowerCase() === normalizedName && category === input.category,
          ) ?? dishesStore.addDish(input))
      if (!dish) throw new Error('La comida no existe')
      const planned = scheduleDish(dish.id, input.day)
      return { ...planned, name: dish.name, description: dish.description, category: dish.category }
    }

    const removeMeal = (mealId: Meal['id']): void => {
      plannedMeals.value = plannedMeals.value.filter(({ id }) => id !== mealId)
    }

    const updateMeal = (mealId: Meal['id'], input: CreateMealInput): void => {
      const planned = plannedMeals.value.find(({ id }) => id === mealId)
      if (!planned) return
      dishesStore.updateDish(planned.dishId, input)
      if (planned.day !== input.day) {
        plannedMeals.value = plannedMeals.value.filter(
          (meal) =>
            meal.id !== mealId && !(meal.dishId === planned.dishId && meal.day === input.day),
        )
        planned.day = input.day
        plannedMeals.value.push(planned)
      }
    }

    const syncDishDays = (dishId: Dish['id'], selectedDays: Weekday[]): PlannedMeal[] => {
      const days = [...new Set(selectedDays)]
      plannedMeals.value = plannedMeals.value.filter(
        (meal) => meal.dishId !== dishId || days.includes(meal.day),
      )
      return days.map((day) => scheduleDish(dishId, day))
    }

    const syncMealDays = (
      mealId: Meal['id'],
      details: MealDetailsInput,
      days: Weekday[],
    ): Meal[] => {
      const planned = plannedMeals.value.find(({ id }) => id === mealId)
      if (!planned) return []
      dishesStore.updateDish(planned.dishId, details)
      syncDishDays(planned.dishId, days)
      return meals.value.filter(({ dishId }) => dishId === planned.dishId)
    }

    return {
      plannedMeals,
      legacyMeals,
      meals,
      mealCount,
      mealsByDay,
      addMeal,
      updateMeal,
      scheduleDish,
      syncDishDays,
      syncMealDays,
      removeMeal,
      migrateLegacyMeals,
    }
  },
  {
    persist: {
      afterHydrate: ({ store }) => {
        const state = store.$state as { meals?: LegacyMeal[]; legacyMeals: LegacyMeal[] }
        if (state.meals?.length) state.legacyMeals = state.meals
        store.migrateLegacyMeals()
      },
    },
  },
)
