export type Weekday =
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner'

export interface Meal {
  id: string
  name: string
  day: Weekday
  category: MealCategory
  createdAt: string
}

export interface FavoriteMeal {
  id: string
  name: string
  defaultCategory: MealCategory
}
