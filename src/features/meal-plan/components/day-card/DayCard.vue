<script setup lang="ts">
import type { WeekdayOption } from '@/common/constants/weekdays'
import type { Meal } from '@/common/types/meal'
import MealList from '@/features/meal-plan/components/meal-list/MealList.vue'

defineOptions({ name: 'DayCard' })

defineProps<{
  day: WeekdayOption
  meals: Meal[]
}>()

const emit = defineEmits<{
  remove: [mealId: Meal['id']]
}>()
</script>

<template>
  <article class="day-card">
    <header class="day-card__header">
      <div>
        <span>{{ day.shortLabel }}</span>
        <h2>{{ day.label }}</h2>
      </div>
      <span class="day-card__count" :aria-label="`${meals.length} platos`">
        {{ meals.length }}
      </span>
    </header>

    <MealList v-if="meals.length" :meals="meals" @remove="emit('remove', $event)" />

    <div v-else class="day-card__empty">
      <span class="material-icons-outlined" aria-hidden="true">restaurant_menu</span>
      <p>Aún no hay platos</p>
      <small>La mesa está esperando.</small>
    </div>
  </article>
</template>

<style scoped src="./DayCard.styles.scss" lang="scss"></style>
