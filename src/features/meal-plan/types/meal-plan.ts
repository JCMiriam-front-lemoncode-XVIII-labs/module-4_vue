import type { Dish, Meal, MealCategory, Weekday } from '@/common/types/meal'

export interface CreateMealInput {
  dishId?: Dish['id']
  name: string
  description?: string
  day: Weekday
  category: MealCategory
}

export type UpdateMealInput = CreateMealInput

export type MealDetailsInput = Omit<CreateMealInput, 'day'>

export type WeeklyMeals = Record<Weekday, Meal[]>
