import type { Meal, MealCategory, Weekday } from '@/common/types/meal'

export interface CreateMealInput {
  name: string
  day: Weekday
  category: MealCategory
}

export type WeeklyMeals = Record<Weekday, Meal[]>
