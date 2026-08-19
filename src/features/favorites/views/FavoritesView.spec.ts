import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import FavoritesView from '@/features/favorites/views/FavoritesView.vue'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('FavoritesView', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('creates, schedules and removes a favorite', async () => {
    const wrapper = mount(FavoritesView)
    const favoritesStore = useFavoritesStore()
    const mealPlanStore = useMealPlanStore()

    await wrapper.get('input[name="favorite-name"]').setValue('Tortilla')
    await wrapper.get('select[name="favorite-category"]').setValue('dinner')
    await wrapper.get('form').trigger('submit')

    expect(favoritesStore.favoriteCount).toBe(1)
    expect(wrapper.text()).toContain('Tortilla')

    await wrapper.get('.favorite-card select').setValue('friday')
    await wrapper.get('.favorite-card__schedule button').trigger('click')

    expect(mealPlanStore.meals[0]).toMatchObject({
      name: 'Tortilla',
      day: 'friday',
      category: 'dinner',
    })

    await wrapper.get('button[aria-label="Eliminar Tortilla de favoritos"]').trigger('click')

    expect(favoritesStore.favorites).toEqual([])
  })
})
