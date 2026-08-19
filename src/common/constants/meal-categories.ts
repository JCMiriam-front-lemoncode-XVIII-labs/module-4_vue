import type { MealCategory } from '@/common/types/meal'

export interface MealCategoryOption {
  value: MealCategory
  label: string
}

export const MEAL_CATEGORIES: readonly MealCategoryOption[] = [
  { value: 'breakfast', label: 'Desayuno' },
  { value: 'lunch', label: 'Comida' },
  { value: 'snack', label: 'Merienda' },
  { value: 'dinner', label: 'Cena' },
]
