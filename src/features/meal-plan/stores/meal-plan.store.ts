import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { WEEKDAYS } from '@/common/constants/weekdays'
import type { Meal } from '@/common/types/meal'
import type { CreateMealInput, WeeklyMeals } from '@/features/meal-plan/types/meal-plan'

const createEmptyWeeklyMeals = (): WeeklyMeals =>
  WEEKDAYS.reduce<WeeklyMeals>((weeklyMeals, { value }) => {
    weeklyMeals[value] = []

    return weeklyMeals
  }, {} as WeeklyMeals)

export const useMealPlanStore = defineStore(
  'meal-plan',
  () => {
    const meals = ref<Meal[]>([])

    const mealCount = computed(() => meals.value.length)

    const mealsByDay = computed<WeeklyMeals>(() => {
      const weeklyMeals = createEmptyWeeklyMeals()

      for (const meal of meals.value) {
        weeklyMeals[meal.day].push(meal)
      }

      return weeklyMeals
    })

    const addMeal = (input: CreateMealInput): Meal => {
      const name = input.name.trim()

      if (!name) {
        throw new Error('El nombre del plato es obligatorio')
      }

      const meal: Meal = {
        ...input,
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
      }

      meals.value.push(meal)

      return meal
    }

    const removeMeal = (mealId: Meal['id']): void => {
      meals.value = meals.value.filter(({ id }) => id !== mealId)
    }

    return {
      meals,
      mealCount,
      mealsByDay,
      addMeal,
      removeMeal,
    }
  },
  {
    persist: true,
  },
)
