import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'

describe('useFavoritesStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('adds and removes a favorite', () => {
    const store = useFavoritesStore()
    const favorite = store.addFavorite({ name: 'Gazpacho', defaultCategory: 'lunch' })

    expect(store.favoriteCount).toBe(1)

    store.removeFavorite(favorite.id)

    expect(store.favorites).toEqual([])
  })

  it('avoids duplicated names regardless of casing', () => {
    const store = useFavoritesStore()

    store.addFavorite({ name: 'Tortilla', defaultCategory: 'dinner' })
    store.addFavorite({ name: 'tortilla', defaultCategory: 'lunch' })

    expect(store.favoriteCount).toBe(1)
    expect(store.isFavorite('  TORTILLA ')).toBe(true)
    expect(store.isFavorite('Gazpacho')).toBe(false)
  })

  it('toggles a catalog dish using its stable id', () => {
    const store = useFavoritesStore()

    store.toggleFavorite('dish-tortilla-patatas')
    expect(store.isFavorite('Tortilla de patatas', 'dish-tortilla-patatas')).toBe(true)

    store.toggleFavorite('dish-tortilla-patatas')
    expect(store.isFavorite('Tortilla de patatas', 'dish-tortilla-patatas')).toBe(false)
  })
})
