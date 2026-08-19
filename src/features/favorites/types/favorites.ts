import type { MealCategory } from '@/common/types/meal'

export interface CreateFavoriteInput {
  name: string
  defaultCategory: MealCategory
}
