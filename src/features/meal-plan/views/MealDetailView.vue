<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { WEEKDAYS } from '@/common/constants/weekdays'
import type { MealCategory, Weekday } from '@/common/types/meal'
import { useToastStore } from '@/common/stores/toast.store'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

const route = useRoute()
const router = useRouter()
const mealPlanStore = useMealPlanStore()
const dishesStore = useDishesStore()
const favoritesStore = useFavoritesStore()
const toastStore = useToastStore()
const isCreateMode = computed(() => route.name === 'meal-create')
const meal = computed(() => mealPlanStore.meals.find(({ id }) => id === route.params.id))
const dish = computed(() =>
  route.name === 'dish-detail'
    ? dishesStore.dishes.find(({ id }) => id === route.params.id)
    : dishesStore.dishes.find(({ id }) => id === meal.value?.dishId),
)
const name = ref('')
const description = ref('')
const category = ref<MealCategory>('lunch')
const selectedDays = ref<Weekday[]>(['monday'])
const errorMessage = ref('')
const isFavorite = computed(
  () => Boolean(name.value.trim()) && favoritesStore.isFavorite(name.value, dish.value?.id),
)

const hydrateForm = (): void => {
  if (isCreateMode.value) {
    name.value = ''
    description.value = ''
    category.value = 'lunch'
    selectedDays.value = ['monday']
    return
  }
  if (!dish.value) return
  name.value = dish.value.name
  description.value = dish.value.description ?? ''
  category.value = dish.value.category
  selectedDays.value = mealPlanStore.meals
    .filter(({ dishId }) => dishId === dish.value?.id)
    .map(({ day }) => day)
}

watch(() => route.fullPath, hydrateForm, { immediate: true })

const saveMeal = async (): Promise<void> => {
  if (!name.value.trim()) {
    errorMessage.value = 'El título es obligatorio.'
    return
  }
  if (!selectedDays.value.length) {
    errorMessage.value = 'Selecciona al menos un día.'
    return
  }
  const details = { name: name.value, description: description.value, category: category.value }
  if (isCreateMode.value) {
    const createdDish = dishesStore.addDish(details)
    mealPlanStore.syncDishDays(createdDish.id, selectedDays.value)
    await router.replace({ name: 'dish-detail', params: { id: createdDish.id } })
  } else if (dish.value) {
    dishesStore.updateDish(dish.value.id, details)
    mealPlanStore.syncDishDays(dish.value.id, selectedDays.value)
  }
  errorMessage.value = ''
  toastStore.showToast('Cambios guardados.')
}

const saveToCatalog = async (): Promise<void> => {
  if (!name.value.trim()) {
    errorMessage.value = 'El título es obligatorio.'
    return
  }
  const createdDish = dishesStore.addDish({
    name: name.value,
    description: description.value,
    category: category.value,
  })
  await router.replace({ name: 'dish-detail', params: { id: createdDish.id } })
  errorMessage.value = ''
  toastStore.showToast('Comida guardada en el catálogo.')
}

const deleteMeal = async (): Promise<void> => {
  if (!dish.value) return
  for (const planned of mealPlanStore.meals.filter(({ dishId }) => dishId === dish.value?.id)) {
    mealPlanStore.removeMeal(planned.id)
  }
  await router.push({ name: 'weekly-plan' })
  toastStore.showToast('Comida eliminada del plan.', 'info')
}

const addToFavorites = (): void => {
  if (!name.value.trim()) {
    errorMessage.value = 'Escribe un título antes de añadir a favoritos.'
    return
  }
  favoritesStore.addFavorite({
    dishId: dish.value?.id,
    name: name.value,
    defaultCategory: category.value,
  })
  toastStore.showToast('Añadida a favoritos.')
}
</script>

<template>
  <section v-if="isCreateMode || dish" class="meal-detail" aria-labelledby="meal-detail-title">
    <RouterLink class="meal-detail__back" to="/">
      <span class="material-icons-outlined" aria-hidden="true">arrow_back</span>
      Volver al plan
    </RouterLink>
    <header>
      <p>{{ isCreateMode ? 'Nueva comida' : 'Detalle del plato' }}</p>
      <h1 id="meal-detail-title">{{ isCreateMode ? 'Añade una comida' : dish?.name }}</h1>
    </header>
    <form class="meal-detail__layout" @submit.prevent="saveMeal">
      <div class="detail-card">
        <h2>Información</h2>
        <label>Título<input v-model="name" name="detail-name" maxlength="80" /></label>
        <label>
          Descripción
          <textarea
            v-model="description"
            name="detail-description"
            rows="5"
            maxlength="240"
          ></textarea>
        </label>
        <label>
          Categoría
          <select v-model="category" name="detail-category">
            <option v-for="option in MEAL_CATEGORIES" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
        <p v-if="errorMessage" class="detail-card__error" role="alert">{{ errorMessage }}</p>
      </div>
      <aside class="detail-card">
        <h2>Días de la semana</h2>
        <p>Marca todos los días en los que quieres planificar esta comida.</p>
        <div class="repeat-days">
          <label v-for="option in WEEKDAYS" :key="option.value">
            <input v-model="selectedDays" type="checkbox" :value="option.value" />
            {{ option.label }}
          </label>
        </div>
        <button class="primary-button" type="submit">
          <span class="material-icons-outlined" aria-hidden="true">event_repeat</span>
          {{ isCreateMode ? 'Crear y añadir al plan' : 'Guardar planificación' }}
        </button>
        <button v-if="isCreateMode" class="favorite-button" type="button" @click="saveToCatalog">
          <span class="material-icons-outlined" aria-hidden="true">save</span>
          Guardar sin planificar
        </button>
        <button
          class="favorite-button"
          :class="{ 'favorite-button--active': isFavorite }"
          type="button"
          @click="addToFavorites"
        >
          <span class="material-icons-outlined" aria-hidden="true">
            {{ isFavorite ? 'favorite' : 'favorite_border' }}
          </span>
          {{ isFavorite ? 'Ya está en favoritos' : 'Añadir a favoritos' }}
        </button>
        <button v-if="!isCreateMode" class="danger-button" type="button" @click="deleteMeal">
          <span class="material-icons-outlined" aria-hidden="true">delete_outline</span>
          Eliminar del plan
        </button>
      </aside>
    </form>
  </section>
  <section v-else class="meal-detail meal-detail--missing">
    <span class="material-icons-outlined" aria-hidden="true">no_meals</span>
    <h1>Este plato ya no está en el plan</h1>
    <RouterLink to="/">Volver al plan semanal</RouterLink>
  </section>
</template>

<style scoped src="./MealDetailView.styles.scss" lang="scss"></style>
