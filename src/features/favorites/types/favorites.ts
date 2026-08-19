import type { Dish, MealCategory } from '@/common/types/meal'

export interface CreateFavoriteInput {
  dishId?: Dish['id']
  name: string
  defaultCategory: MealCategory
}
