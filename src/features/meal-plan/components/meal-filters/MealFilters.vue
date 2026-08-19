<script setup lang="ts">
import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { WEEKDAYS } from '@/common/constants/weekdays'
import type { MealCategory, Weekday } from '@/common/types/meal'

defineOptions({ name: 'MealFilters' })

defineProps<{
  query: string
  day: Weekday | 'all'
  category: MealCategory | 'all'
  resultCount: number
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:day': [value: Weekday | 'all']
  'update:category': [value: MealCategory | 'all']
}>()

const resetFilters = (): void => {
  emit('update:query', '')
  emit('update:day', 'all')
  emit('update:category', 'all')
}
</script>

<template>
  <section class="meal-filters" aria-label="Buscar y filtrar platos">
    <div class="meal-filters__search">
      <label for="meal-search">Buscar</label>
      <div>
        <span class="material-icons-outlined" aria-hidden="true">search</span>
        <input
          id="meal-search"
          :value="query"
          type="search"
          placeholder="Buscar por nombre"
          @input="emit('update:query', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <div class="meal-filters__field">
      <label for="meal-day-filter">Día</label>
      <select
        id="meal-day-filter"
        :value="day"
        @change="emit('update:day', ($event.target as HTMLSelectElement).value as Weekday | 'all')"
      >
        <option value="all">Todos los días</option>
        <option v-for="option in WEEKDAYS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div class="meal-filters__field">
      <label for="meal-category-filter">Categoría</label>
      <select
        id="meal-category-filter"
        :value="category"
        @change="
          emit(
            'update:category',
            ($event.target as HTMLSelectElement).value as MealCategory | 'all',
          )
        "
      >
        <option value="all">Todas</option>
        <option v-for="option in MEAL_CATEGORIES" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <div class="meal-filters__summary" aria-live="polite">
      <span>{{ resultCount }} resultados</span>
      <button v-if="hasActiveFilters" type="button" @click="resetFilters">
        <span class="material-icons-outlined" aria-hidden="true">filter_alt_off</span>
        Limpiar
      </button>
    </div>
  </section>
</template>

<style scoped src="./MealFilters.styles.scss" lang="scss"></style>
