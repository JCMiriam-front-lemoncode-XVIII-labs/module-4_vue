<script setup lang="ts">
import { ref, useId } from 'vue'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { WEEKDAYS } from '@/common/constants/weekdays'
import type { MealCategory, Weekday } from '@/common/types/meal'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

defineOptions({ name: 'MealForm' })

const mealPlanStore = useMealPlanStore()
const fieldId = useId()

const name = ref('')
const day = ref<Weekday>('monday')
const category = ref<MealCategory>('lunch')
const errorMessage = ref('')

const resetForm = (): void => {
  name.value = ''
  day.value = 'monday'
  category.value = 'lunch'
  errorMessage.value = ''
}

const handleSubmit = (): void => {
  if (!name.value.trim()) {
    errorMessage.value = 'Escribe el nombre del plato.'
    return
  }

  mealPlanStore.addMeal({
    name: name.value,
    day: day.value,
    category: category.value,
  })

  resetForm()
}
</script>

<template>
  <section class="meal-form-card" aria-labelledby="meal-form-title">
    <div class="meal-form-card__heading">
      <span class="material-icons-outlined" aria-hidden="true">add_circle</span>
      <div>
        <h2 id="meal-form-title">Añade un plato</h2>
        <p>Empieza a darle forma a tu semana.</p>
      </div>
    </div>

    <form class="meal-form" novalidate @submit.prevent="handleSubmit">
      <div class="meal-form__field meal-form__field--name">
        <label :for="`${fieldId}-name`">Nombre del plato</label>
        <input
          :id="`${fieldId}-name`"
          v-model="name"
          name="name"
          type="text"
          maxlength="80"
          placeholder="Ej. Lentejas con verduras"
          autocomplete="off"
          :aria-invalid="Boolean(errorMessage)"
          :aria-describedby="errorMessage ? `${fieldId}-error` : undefined"
          @input="errorMessage = ''"
        />
        <p v-if="errorMessage" :id="`${fieldId}-error`" class="meal-form__error" role="alert">
          {{ errorMessage }}
        </p>
      </div>

      <div class="meal-form__field">
        <label :for="`${fieldId}-day`">Día</label>
        <select :id="`${fieldId}-day`" v-model="day" name="day">
          <option v-for="option in WEEKDAYS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="meal-form__field">
        <label :for="`${fieldId}-category`">Categoría</label>
        <select :id="`${fieldId}-category`" v-model="category" name="category">
          <option v-for="option in MEAL_CATEGORIES" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <button class="meal-form__submit" type="submit">
        <span class="material-icons-outlined" aria-hidden="true">add</span>
        Agregar
      </button>
    </form>
  </section>
</template>

<style scoped src="./MealForm.styles.scss" lang="scss"></style>
