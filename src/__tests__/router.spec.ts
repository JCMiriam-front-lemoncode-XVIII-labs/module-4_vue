import { describe, expect, it } from 'vitest'

import { routes } from '@/app/router'

describe('application routes', () => {
  it('provides the required planner and favorites views', () => {
    expect(routes.map(({ name }) => name)).toEqual(
      expect.arrayContaining(['weekly-plan', 'favorites', 'not-found']),
    )
  })
})
