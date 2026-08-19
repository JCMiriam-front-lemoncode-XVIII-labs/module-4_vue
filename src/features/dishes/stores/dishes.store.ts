import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Dish } from '@/common/types/meal'
import dishesMock from '@/features/dishes/data/dishes.mock.json'
import type { DishInput } from '@/features/dishes/types/dishes'

const initialDishes = dishesMock as Dish[]

export const useDishesStore = defineStore(
  'dishes',
  () => {
    const dishes = ref<Dish[]>(initialDishes.map((dish) => ({ ...dish })))
    const dishCount = computed(() => dishes.value.length)

    const addDish = (input: DishInput): Dish => {
      const name = input.name.trim()
      if (!name) throw new Error('El nombre del plato es obligatorio')
      const existing = dishes.value.find(
        (dish) =>
          dish.name.toLocaleLowerCase() === name.toLocaleLowerCase() &&
          dish.category === input.category,
      )
      if (existing) {
        if (input.description?.trim()) existing.description = input.description.trim()
        return existing
      }
      const dish: Dish = {
        id: crypto.randomUUID(),
        name,
        description: input.description?.trim() ?? '',
        category: input.category,
        createdAt: new Date().toISOString(),
      }
      dishes.value.push(dish)
      return dish
    }

    const updateDish = (dishId: Dish['id'], input: DishInput): void => {
      const dish = dishes.value.find(({ id }) => id === dishId)
      const name = input.name.trim()
      if (dish && name)
        Object.assign(dish, { ...input, name, description: input.description?.trim() ?? '' })
    }

    const removeDish = (dishId: Dish['id']): void => {
      dishes.value = dishes.value.filter(({ id }) => id !== dishId)
    }

    return { dishes, dishCount, addDish, updateDish, removeDish }
  },
  {
    persist: {
      afterHydrate: ({ store }) => {
        const state = store.$state as { dishes: Dish[] }
        const persistedIds = new Set(state.dishes.map(({ id }) => id))
        state.dishes.push(
          ...initialDishes.filter(({ id }) => !persistedIds.has(id)).map((dish) => ({ ...dish })),
        )
      },
    },
  },
)
