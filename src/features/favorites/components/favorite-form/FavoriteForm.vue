<script setup lang="ts">
import { ref, useId } from 'vue'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import type { MealCategory } from '@/common/types/meal'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'

defineOptions({ name: 'FavoriteForm' })

const favoritesStore = useFavoritesStore()
const fieldId = useId()
const name = ref('')
const category = ref<MealCategory>('lunch')
const errorMessage = ref('')

const handleSubmit = (): void => {
  if (!name.value.trim()) {
    errorMessage.value = 'Escribe el nombre del plato.'
    return
  }

  favoritesStore.addFavorite({ name: name.value, defaultCategory: category.value })
  name.value = ''
  category.value = 'lunch'
  errorMessage.value = ''
}
</script>

<template>
  <form class="favorite-form" novalidate @submit.prevent="handleSubmit">
    <div class="favorite-form__field favorite-form__field--name">
      <label :for="`${fieldId}-favorite-name`">Nombre del plato</label>
      <input
        :id="`${fieldId}-favorite-name`"
        v-model="name"
        name="favorite-name"
        maxlength="80"
        placeholder="Ej. Tortilla de patatas"
        :aria-invalid="Boolean(errorMessage)"
        @input="errorMessage = ''"
      />
      <p v-if="errorMessage" class="favorite-form__error" role="alert">{{ errorMessage }}</p>
    </div>
    <div class="favorite-form__field">
      <label :for="`${fieldId}-favorite-category`">Categoría habitual</label>
      <select :id="`${fieldId}-favorite-category`" v-model="category" name="favorite-category">
        <option v-for="option in MEAL_CATEGORIES" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <button type="submit">
      <span class="material-icons-outlined" aria-hidden="true">favorite</span>
      Guardar favorito
    </button>
  </form>
</template>

<style scoped src="./FavoriteForm.styles.scss" lang="scss"></style>
