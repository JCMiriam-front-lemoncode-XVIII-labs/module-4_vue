<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { WEEKDAYS } from '@/common/constants/weekdays'
import DayCard from '@/features/meal-plan/components/day-card/DayCard.vue'
import MealForm from '@/features/meal-plan/components/meal-form/MealForm.vue'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

const mealPlanStore = useMealPlanStore()
const { mealCount, mealsByDay } = storeToRefs(mealPlanStore)
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

    <MealForm />

    <div class="week-grid" aria-label="Días de la semana">
      <DayCard
        v-for="day in WEEKDAYS"
        :key="day.value"
        :day="day"
        :meals="mealsByDay[day.value]"
        @remove="mealPlanStore.removeMeal"
      />
    </div>
  </section>
</template>

<style scoped src="./WeeklyPlanView.styles.scss" lang="scss"></style>
