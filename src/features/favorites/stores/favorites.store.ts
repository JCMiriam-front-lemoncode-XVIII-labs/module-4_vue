import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { FavoriteMeal } from '@/common/types/meal'
import type { CreateFavoriteInput } from '@/features/favorites/types/favorites'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'

export const useFavoritesStore = defineStore(
  'favorites',
  () => {
    const favorites = ref<FavoriteMeal[]>([])
    const dishesStore = useDishesStore()
    const favoriteCount = computed(() => favorites.value.length)

    const addFavorite = (input: CreateFavoriteInput): FavoriteMeal => {
      const name = input.name.trim()

      if (!name) {
        throw new Error('El nombre del plato es obligatorio')
      }

      const dish = input.dishId
        ? dishesStore.dishes.find(({ id }) => id === input.dishId)
        : (dishesStore.dishes.find(
            ({ name: dishName }) => dishName.toLocaleLowerCase() === name.toLocaleLowerCase(),
          ) ?? dishesStore.addDish({ name, category: input.defaultCategory }))
      const existingFavorite = favorites.value.find(
        (favorite) =>
          favorite.dishId === dish?.id ||
          favorite.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      )

      if (existingFavorite) {
        return existingFavorite
      }

      const favorite: FavoriteMeal = {
        id: crypto.randomUUID(),
        dishId: dish?.id,
        name,
        defaultCategory: input.defaultCategory,
      }

      favorites.value.push(favorite)

      return favorite
    }

    const removeFavorite = (favoriteId: FavoriteMeal['id']): void => {
      favorites.value = favorites.value.filter(({ id }) => id !== favoriteId)
    }

    const removeFavoriteByDish = (dishId: string): void => {
      favorites.value = favorites.value.filter((favorite) => favorite.dishId !== dishId)
    }

    const isFavorite = (mealName: string, dishId?: string): boolean =>
      favorites.value.some(
        (favorite) =>
          favorite.dishId === dishId ||
          favorite.name.toLocaleLowerCase() === mealName.trim().toLocaleLowerCase(),
      )

    const toggleFavorite = (dishId: string): void => {
      const dish = dishesStore.dishes.find(({ id }) => id === dishId)
      if (!dish) return
      const favorite = favorites.value.find((candidate) => candidate.dishId === dishId)
      if (favorite) removeFavorite(favorite.id)
      else addFavorite({ dishId, name: dish.name, defaultCategory: dish.category })
    }

    return {
      favorites,
      favoriteCount,
      addFavorite,
      removeFavorite,
      removeFavoriteByDish,
      isFavorite,
      toggleFavorite,
    }
  },
  { persist: true },
)
