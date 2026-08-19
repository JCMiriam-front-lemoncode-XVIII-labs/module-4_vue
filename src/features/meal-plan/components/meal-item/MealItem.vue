<script setup lang="ts">
import { computed } from 'vue'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import type { Meal } from '@/common/types/meal'

defineOptions({ name: 'MealItem' })

const props = defineProps<{
  meal: Meal
}>()

const emit = defineEmits<{
  remove: [mealId: Meal['id']]
}>()

const categoryLabel = computed(
  () => MEAL_CATEGORIES.find(({ value }) => value === props.meal.category)?.label ?? '',
)
</script>

<template>
  <li class="meal-item">
    <div class="meal-item__content">
      <span class="meal-item__category">{{ categoryLabel }}</span>
      <p>{{ meal.name }}</p>
    </div>
    <button
      class="meal-item__remove"
      type="button"
      :aria-label="`Eliminar ${meal.name}`"
      :title="`Eliminar ${meal.name}`"
      @click="emit('remove', meal.id)"
    >
      <span class="material-icons-outlined" aria-hidden="true">delete_outline</span>
    </button>
  </li>
</template>

<style scoped src="./MealItem.styles.scss" lang="scss"></style>
