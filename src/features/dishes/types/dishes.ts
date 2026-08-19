import type { Dish, MealCategory } from '@/common/types/meal'

export interface DishInput {
  name: string
  description?: string
  category: MealCategory
}

export type DishId = Dish['id']
