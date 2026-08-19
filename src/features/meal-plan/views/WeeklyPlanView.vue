<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { WEEKDAYS } from '@/common/constants/weekdays'
import type { MealCategory, Weekday } from '@/common/types/meal'
import DayCard from '@/features/meal-plan/components/day-card/DayCard.vue'
import MealFilters from '@/features/meal-plan/components/meal-filters/MealFilters.vue'
import PlanActions from '@/features/meal-plan/components/plan-actions/PlanActions.vue'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

const mealPlanStore = useMealPlanStore()
const { mealCount, meals } = storeToRefs(mealPlanStore)
const query = ref('')
const selectedDay = ref<Weekday | 'all'>('all')
const selectedCategory = ref<MealCategory | 'all'>('all')

const hasActiveFilters = computed(
  () =>
    Boolean(query.value.trim()) || selectedDay.value !== 'all' || selectedCategory.value !== 'all',
)

const filteredMeals = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()

  return meals.value.filter(
    (meal) =>
      (!normalizedQuery || meal.name.toLocaleLowerCase().includes(normalizedQuery)) &&
      (selectedDay.value === 'all' || meal.day === selectedDay.value) &&
      (selectedCategory.value === 'all' || meal.category === selectedCategory.value),
  )
})

const visibleDays = computed(() =>
  selectedDay.value === 'all'
    ? WEEKDAYS
    : WEEKDAYS.filter(({ value }) => value === selectedDay.value),
)

const mealsForDay = (day: Weekday) => filteredMeals.value.filter((meal) => meal.day === day)
</script>

<template>
  <section class="weekly-plan" aria-labelledby="weekly-plan-title">
    <header class="page-heading">
      <div>
        <p class="page-heading__eyebrow">Organiza · Cocina · Disfruta</p>
        <h1 id="weekly-plan-title">Tu plan semanal</h1>
        <p class="page-heading__description">
          Organiza tus comidas de un vistazo y haz que decidir qué cocinar sea la parte fácil.
        </p>
      </div>
      <div
        class="meal-count"
        :aria-label="`${mealCount} ${mealCount === 1 ? 'plato planificado' : 'platos planificados'}`"
      >
        <strong>{{ mealCount }}</strong>
        <span>{{ mealCount === 1 ? 'plato esta semana' : 'platos esta semana' }}</span>
      </div>
    </header>

    <PlanActions :meals="meals" />

    <MealFilters
      v-model:query="query"
      v-model:day="selectedDay"
      v-model:category="selectedCategory"
      :result-count="filteredMeals.length"
      :has-active-filters="hasActiveFilters"
    />

    <p v-if="hasActiveFilters && !filteredMeals.length" class="no-results" role="status">
      <span class="material-icons-outlined" aria-hidden="true">search_off</span>
      No encontramos platos con esos filtros.
    </p>

    <div class="week-grid" aria-label="Días de la semana">
      <DayCard
        v-for="day in visibleDays"
        :key="day.value"
        :day="day"
        :meals="mealsForDay(day.value)"
        @remove="mealPlanStore.removeMeal"
      />
    </div>
  </section>
</template>

<style scoped src="./WeeklyPlanView.styles.scss" lang="scss"></style>
