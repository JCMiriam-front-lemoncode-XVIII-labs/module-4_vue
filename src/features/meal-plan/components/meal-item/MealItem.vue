<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import type { Meal } from '@/common/types/meal'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'

defineOptions({ name: 'MealItem' })

const props = defineProps<{
  meal: Meal
}>()

const emit = defineEmits<{
  remove: [mealId: Meal['id']]
}>()

const favoritesStore = useFavoritesStore()

const categoryLabel = computed(
  () => MEAL_CATEGORIES.find(({ value }) => value === props.meal.category)?.label ?? '',
)

const isFavorite = computed(() => favoritesStore.isFavorite(props.meal.name))

const saveAsFavorite = (): void => {
  favoritesStore.addFavorite({
    name: props.meal.name,
    defaultCategory: props.meal.category,
  })
}
</script>

<template>
  <li class="meal-item">
    <div class="meal-item__content">
      <span class="meal-item__category">{{ categoryLabel }}</span>
      <RouterLink :to="{ name: 'meal-detail', params: { id: meal.id } }">
        {{ meal.name }}
      </RouterLink>
    </div>
    <div class="meal-item__actions">
      <button
        :class="{ 'meal-item__favorite--active': isFavorite }"
        type="button"
        :aria-label="
          isFavorite ? `${meal.name} está en favoritos` : `Guardar ${meal.name} en favoritos`
        "
        @click="saveAsFavorite"
      >
        <span class="material-icons-outlined" aria-hidden="true">
          {{ isFavorite ? 'favorite' : 'favorite_border' }}
        </span>
      </button>
      <button
        class="meal-item__remove"
        type="button"
        :aria-label="`Eliminar ${meal.name}`"
        @click="emit('remove', meal.id)"
      >
        <span class="material-icons-outlined" aria-hidden="true">delete_outline</span>
      </button>
    </div>
  </li>
</template>

<style scoped src="./MealItem.styles.scss" lang="scss"></style>
