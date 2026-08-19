<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

const dishesStore = useDishesStore()
const mealPlanStore = useMealPlanStore()
const { dishes, dishCount } = storeToRefs(dishesStore)

const categoryLabel = (category: string): string =>
  MEAL_CATEGORIES.find(({ value }) => value === category)?.label ?? ''

const plannedDays = (dishId: string): number =>
  mealPlanStore.plannedMeals.filter((meal) => meal.dishId === dishId).length
</script>

<template>
  <section class="dishes" aria-labelledby="dishes-title">
    <header class="page-heading dishes__heading">
      <div>
        <p class="page-heading__eyebrow">Tu recetario</p>
        <h1 id="dishes-title">Comidas</h1>
        <p>Aquí viven tus platos, estén o no incluidos en el plan semanal.</p>
      </div>
      <RouterLink class="dishes__create" :to="{ name: 'meal-create' }">
        <span class="material-icons-outlined" aria-hidden="true">add</span>
        Crear comida
      </RouterLink>
    </header>

    <p class="dishes__count">
      {{ dishCount }} {{ dishCount === 1 ? 'comida guardada' : 'comidas guardadas' }}
    </p>
    <div v-if="dishes.length" class="dishes__grid">
      <RouterLink
        v-for="dish in dishes"
        :key="dish.id"
        class="dish-card"
        :to="{ name: 'dish-detail', params: { id: dish.id } }"
      >
        <span class="dish-card__category">{{ categoryLabel(dish.category) }}</span>
        <h2>{{ dish.name }}</h2>
        <p>{{ dish.description || 'Sin descripción.' }}</p>
        <small
          >{{ plannedDays(dish.id) }}
          {{ plannedDays(dish.id) === 1 ? 'día planificado' : 'días planificados' }}</small
        >
      </RouterLink>
    </div>
    <div v-else class="dishes__empty">
      <span class="material-icons-outlined" aria-hidden="true">menu_book</span>
      <h2>Todavía no tienes comidas</h2>
      <p>Crea la primera y decide después cuándo quieres planificarla.</p>
    </div>
  </section>
</template>

<style scoped src="./DishesView.styles.scss" lang="scss"></style>
