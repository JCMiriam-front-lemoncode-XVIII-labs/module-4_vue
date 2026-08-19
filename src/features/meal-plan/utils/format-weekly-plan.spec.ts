import { describe, expect, it } from 'vitest'

import type { Meal } from '@/common/types/meal'
import { formatWeeklyPlan } from '@/features/meal-plan/utils/format-weekly-plan'

describe('formatWeeklyPlan', () => {
  it('groups meals by weekday and includes their category', () => {
    const meals: Meal[] = [
      {
        id: 'planned-1',
        dishId: 'dish-1',
        name: 'Lentejas',
        description: '',
        day: 'monday',
        category: 'lunch',
        createdAt: '2026-08-19T10:00:00.000Z',
      },
    ]

    const result = formatWeeklyPlan(meals)

    expect(result).toContain('LUNES\n  - Comida: Lentejas')
    expect(result).toContain('MARTES\n  Sin comidas planificadas')
  })
})
