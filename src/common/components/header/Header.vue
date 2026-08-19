<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({ name: 'MealPlannerHeader' })
</script>

<template>
  <header class="app-header">
    <div class="app-header__content">
      <RouterLink class="brand" to="/" aria-label="Meal Planner, ir al plan semanal">
        <span class="brand__mark" aria-hidden="true">
          <span class="material-icons-outlined">restaurant</span>
        </span>
        <span class="brand__text">
          <strong>Meal Planner</strong>
          <small>Tu semana, bien servida</small>
        </span>
      </RouterLink>

      <nav class="main-nav" aria-label="Navegación principal">
        <RouterLink class="main-nav__link" to="/">
          <span class="material-icons-outlined" aria-hidden="true">calendar_today</span>
          <span>Plan semanal</span>
        </RouterLink>
        <RouterLink class="main-nav__link" to="/favorites">
          <span class="material-icons-outlined" aria-hidden="true">favorite_border</span>
          <span>Favoritos</span>
        </RouterLink>
        <RouterLink class="main-nav__link" to="/dishes">
          <span class="material-icons-outlined" aria-hidden="true">menu_book</span>
          <span>Comidas</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped src="./Header.styles.scss" lang="scss"></style>
