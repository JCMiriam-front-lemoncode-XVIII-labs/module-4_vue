<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import ConfirmationModal from '@/common/components/confirmation-modal/ConfirmationModal.vue'
import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import type { Dish, MealCategory } from '@/common/types/meal'
import { useDishesStore } from '@/features/dishes/stores/dishes.store'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

const dishesStore = useDishesStore()
const favoritesStore = useFavoritesStore()
const mealPlanStore = useMealPlanStore()
const { dishes, dishCount } = storeToRefs(dishesStore)
const query = ref('')
const category = ref<MealCategory | 'all'>('all')
const favoritesOnly = ref(false)
const dishToDelete = ref<Dish>()

const filteredDishes = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase()
  return dishes.value.filter(
    (dish) =>
      (!normalizedQuery ||
        dish.name.toLocaleLowerCase().includes(normalizedQuery) ||
        dish.description?.toLocaleLowerCase().includes(normalizedQuery)) &&
      (category.value === 'all' || dish.category === category.value) &&
      (!favoritesOnly.value || favoritesStore.isFavorite(dish.name, dish.id)),
  )
})

const categoryLabel = (value: string): string =>
  MEAL_CATEGORIES.find((option) => option.value === value)?.label ?? ''
const plannedDays = (dishId: string): number =>
  mealPlanStore.plannedMeals.filter((meal) => meal.dishId === dishId).length

const removeDish = (): void => {
  if (!dishToDelete.value) return
  const dishId = dishToDelete.value.id
  for (const planned of mealPlanStore.plannedMeals.filter((meal) => meal.dishId === dishId)) {
    mealPlanStore.removeMeal(planned.id)
  }
  favoritesStore.removeFavoriteByDish(dishId)
  dishesStore.removeDish(dishId)
  dishToDelete.value = undefined
}
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

    <div class="dish-filters" aria-label="Filtros del catálogo">
      <label class="dish-filters__search">
        <span>Buscar comidas</span>
        <span class="dish-filters__control">
          <span class="material-icons-outlined" aria-hidden="true">search</span>
          <input v-model="query" type="search" placeholder="Título o descripción" />
        </span>
      </label>
      <label>
        <span>Categoría</span>
        <select v-model="category">
          <option value="all">Todas</option>
          <option v-for="option in MEAL_CATEGORIES" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
      <button
        class="dish-filters__favorite"
        :class="{ 'dish-filters__favorite--active': favoritesOnly }"
        type="button"
        :aria-pressed="favoritesOnly"
        @click="favoritesOnly = !favoritesOnly"
      >
        <span class="material-icons-outlined" aria-hidden="true">
          {{ favoritesOnly ? 'favorite' : 'favorite_border' }}
        </span>
        Solo favoritos
      </button>
    </div>

    <p class="dishes__count">
      {{ filteredDishes.length }} de {{ dishCount }}
      {{ dishCount === 1 ? 'comida guardada' : 'comidas guardadas' }}
    </p>
    <div v-if="filteredDishes.length" class="dishes__grid">
      <article v-for="dish in filteredDishes" :key="dish.id" class="dish-card">
        <div class="dish-card__actions">
          <button
            :class="{
              'dish-card__favorite--active': favoritesStore.isFavorite(dish.name, dish.id),
            }"
            type="button"
            :aria-label="
              favoritesStore.isFavorite(dish.name, dish.id)
                ? `Quitar ${dish.name} de favoritos`
                : `Añadir ${dish.name} a favoritos`
            "
            @click.stop="favoritesStore.toggleFavorite(dish.id)"
          >
            <span class="material-icons-outlined" aria-hidden="true">{{
              favoritesStore.isFavorite(dish.name, dish.id) ? 'favorite' : 'favorite_border'
            }}</span>
          </button>
          <button
            type="button"
            :aria-label="`Eliminar ${dish.name}`"
            @click.stop="dishToDelete = dish"
          >
            <span class="material-icons-outlined" aria-hidden="true">delete_outline</span>
          </button>
        </div>
        <RouterLink :to="{ name: 'dish-detail', params: { id: dish.id } }">
          <span class="dish-card__category">{{ categoryLabel(dish.category) }}</span>
          <h2>{{ dish.name }}</h2>
          <p>{{ dish.description || 'Sin descripción.' }}</p>
          <small
            >{{ plannedDays(dish.id) }}
            {{ plannedDays(dish.id) === 1 ? 'día planificado' : 'días planificados' }}</small
          >
        </RouterLink>
      </article>
    </div>
    <div v-else class="dishes__empty">
      <span class="material-icons-outlined" aria-hidden="true">{{
        dishes.length ? 'search_off' : 'menu_book'
      }}</span>
      <h2>{{ dishes.length ? 'No encontramos comidas' : 'Todavía no tienes comidas' }}</h2>
      <p>
        {{
          dishes.length
            ? 'Prueba a cambiar o limpiar los filtros.'
            : 'Crea la primera y decide después cuándo quieres planificarla.'
        }}
      </p>
    </div>

    <ConfirmationModal
      :open="Boolean(dishToDelete)"
      :title="`¿Eliminar ${dishToDelete?.name ?? 'esta comida'}?`"
      description="Se eliminará del catálogo, del plan semanal y de favoritos. Esta acción no se puede deshacer."
      confirm-label="Sí, eliminar"
      @cancel="dishToDelete = undefined"
      @confirm="removeDish"
    />
  </section>
</template>

<style scoped src="./DishesView.styles.scss" lang="scss"></style>
