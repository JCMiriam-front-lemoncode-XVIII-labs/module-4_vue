import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { WEEKDAYS } from '@/common/constants/weekdays'
import type { Meal } from '@/common/types/meal'
import type {
  CreateMealInput,
  MealDetailsInput,
  UpdateMealInput,
  WeeklyMeals,
} from '@/features/meal-plan/types/meal-plan'

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

      const existingMeal = meals.value.find(
        (meal) =>
          meal.day === input.day &&
          meal.category === input.category &&
          meal.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      )

      if (existingMeal) {
        return existingMeal
      }

      const meal: Meal = {
        ...input,
        id: crypto.randomUUID(),
        name,
        description: input.description?.trim() ?? '',
        createdAt: new Date().toISOString(),
      }

      meals.value.push(meal)

      return meal
    }

    const removeMeal = (mealId: Meal['id']): void => {
      meals.value = meals.value.filter(({ id }) => id !== mealId)
    }

    const updateMeal = (mealId: Meal['id'], input: UpdateMealInput): void => {
      const meal = meals.value.find(({ id }) => id === mealId)
      const name = input.name.trim()

      if (!meal || !name) {
        return
      }

      Object.assign(meal, { ...input, name, description: input.description?.trim() ?? '' })
    }

    const syncMealDays = (
      mealId: Meal['id'],
      details: MealDetailsInput,
      selectedDays: Meal['day'][],
    ): Meal[] => {
      const sourceMeal = meals.value.find(({ id }) => id === mealId)
      const name = details.name.trim()

      if (!sourceMeal || !name || !selectedDays.length) {
        return []
      }

      const group = meals.value.filter(
        (meal) =>
          meal.name.toLocaleLowerCase() === sourceMeal.name.toLocaleLowerCase() &&
          meal.category === sourceMeal.category,
      )
      const unrelatedMeals = meals.value.filter((meal) => !group.some(({ id }) => id === meal.id))
      const uniqueDays = [...new Set(selectedDays)]
      const synchronizedMeals = uniqueDays.map((selectedDay) => {
        const existingMeal = group.find(({ day }) => day === selectedDay)

        return {
          id: existingMeal?.id ?? crypto.randomUUID(),
          createdAt: existingMeal?.createdAt ?? new Date().toISOString(),
          ...details,
          name,
          description: details.description?.trim() ?? '',
          day: selectedDay,
        }
      })

      meals.value = [...unrelatedMeals, ...synchronizedMeals]

      return synchronizedMeals
    }

    return {
      meals,
      mealCount,
      mealsByDay,
      addMeal,
      updateMeal,
      syncMealDays,
      removeMeal,
    }
  },
  {
    persist: true,
  },
)
