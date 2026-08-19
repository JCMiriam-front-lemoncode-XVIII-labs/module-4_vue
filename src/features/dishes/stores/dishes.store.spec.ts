import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useDishesStore } from '@/features/dishes/stores/dishes.store'

describe('useDishesStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('loads the initial dishes from the mock catalog', () => {
    const store = useDishesStore()

    expect(store.dishes.length).toBeGreaterThan(0)
    expect(store.dishes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'dish-tortilla-patatas',
          name: 'Tortilla de patatas',
          description: expect.any(String),
          category: 'dinner',
        }),
      ]),
    )
  })

  it('creates a catalog dish without scheduling it', () => {
    const store = useDishesStore()

    const dish = store.addDish({
      name: '  Crema de calabaza  ',
      description: '  Con jengibre  ',
      category: 'dinner',
    })

    expect(dish).toMatchObject({
      name: 'Crema de calabaza',
      description: 'Con jengibre',
      category: 'dinner',
    })
  })

  it('reuses a dish with the same title and category', () => {
    const store = useDishesStore()
    const first = store.addDish({ name: 'Burritos', category: 'dinner' })
    const repeated = store.addDish({ name: 'burritos', category: 'dinner' })

    expect(repeated.id).toBe(first.id)
    expect(store.dishes.filter(({ id }) => id === first.id)).toHaveLength(1)
  })

  it('records removed mock dishes so persistence can keep them deleted', () => {
    const store = useDishesStore()

    store.removeDish('dish-tortilla-patatas')

    expect(store.dishes.some(({ id }) => id === 'dish-tortilla-patatas')).toBe(false)
    expect(store.deletedDishIds).toContain('dish-tortilla-patatas')
  })

  it('removes dishes hydrated from a state without deletion metadata', () => {
    const store = useDishesStore()
    store.$patch({ deletedDishIds: undefined } as never)

    expect(() => store.removeDish('dish-tortilla-patatas')).not.toThrow()
    expect(store.dishes.some(({ id }) => id === 'dish-tortilla-patatas')).toBe(false)
  })
})
