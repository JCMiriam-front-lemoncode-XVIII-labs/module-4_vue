export type Weekday =
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export type MealCategory = 'breakfast' | 'lunch' | 'snack' | 'dinner'

export interface Dish {
  id: string
  name: string
  description?: string
  category: MealCategory
  createdAt: string
}

export interface PlannedMeal {
  id: string
  dishId: Dish['id']
  day: Weekday
  createdAt: string
}

export type Meal = PlannedMeal & Pick<Dish, 'name' | 'description' | 'category'>

export interface FavoriteMeal {
  id: string
  dishId?: Dish['id']
  name: string
  defaultCategory: MealCategory
}
