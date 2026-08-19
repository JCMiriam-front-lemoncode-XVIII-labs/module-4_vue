import { describe, expect, it } from 'vitest'

import { routes } from '@/app/router'

describe('application routes', () => {
  it('provides the planner, catalog, detail and favorites views', () => {
    expect(routes.map(({ name }) => name)).toEqual(
      expect.arrayContaining([
        'weekly-plan',
        'dishes',
        'dish-detail',
        'favorites',
        'meal-create',
        'meal-detail',
        'not-found',
      ]),
    )
  })
})
