import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { WEEKDAYS } from '@/common/constants/weekdays'
import type { Meal } from '@/common/types/meal'

export const formatWeeklyPlan = (meals: Meal[]): string => {
  const lines = ['PLAN SEMANAL', '']

  for (const weekday of WEEKDAYS) {
    lines.push(weekday.label.toUpperCase())
    const dailyMeals = meals.filter(({ day }) => day === weekday.value)

    if (!dailyMeals.length) {
      lines.push('  Sin comidas planificadas')
    } else {
      for (const meal of dailyMeals) {
        const category = MEAL_CATEGORIES.find(({ value }) => value === meal.category)?.label
        lines.push(`  - ${category}: ${meal.name}`)
      }
    }
    lines.push('')
  }

  return lines.join('\n').trimEnd()
}
