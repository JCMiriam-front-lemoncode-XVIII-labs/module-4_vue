import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { FavoriteMeal } from '@/common/types/meal'
import type { CreateFavoriteInput } from '@/features/favorites/types/favorites'

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<FavoriteMeal[]>([])
    const favoriteCount = computed(() => favorites.value.length)

    const addFavorite = (input: CreateFavoriteInput): FavoriteMeal => {
      const name = input.name.trim()

      if (!name) {
        throw new Error('El nombre del plato es obligatorio')
      }

      const existingFavorite = favorites.value.find(
        (favorite) => favorite.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      )

      if (existingFavorite) {
        return existingFavorite
      }

      const favorite: FavoriteMeal = {
        id: crypto.randomUUID(),
        name,
        defaultCategory: input.defaultCategory,
      }

      favorites.value.push(favorite)

      return favorite
    }

    const removeFavorite = (favoriteId: FavoriteMeal['id']): void => {
      favorites.value = favorites.value.filter(({ id }) => id !== favoriteId)
    }

    const isFavorite = (mealName: string): boolean =>
      favorites.value.some(
        ({ name }) => name.toLocaleLowerCase() === mealName.trim().toLocaleLowerCase(),
      )

    return { favorites, favoriteCount, addFavorite, removeFavorite, isFavorite }
  },
  { persist: true },
)
