<script setup lang="ts">
import { WEEKDAYS } from '@/common/constants/weekdays'
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
      <div class="meal-count" aria-label="0 platos planificados">
        <strong>0</strong>
        <span>platos esta semana</span>
      </div>
    </header>

    <div class="week-grid" aria-label="Días de la semana">
      <article v-for="day in WEEKDAYS" :key="day.value" class="day-card">
        <header class="day-card__header">
          <div>
            <span>{{ day.shortLabel }}</span>
            <h2>{{ day.label }}</h2>
          </div>
          <span class="day-card__count" aria-label="0 platos">0</span>
        </header>
        <div class="day-card__empty">
          <span class="material-icons-outlined" aria-hidden="true">restaurant_menu</span>
          <p>Aún no hay platos</p>
          <small>La mesa está esperando.</small>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped src="./WeeklyPlanView.styles.scss" lang="scss"></style>
