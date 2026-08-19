<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { MEAL_CATEGORIES } from '@/common/constants/meal-categories'
import { WEEKDAYS } from '@/common/constants/weekdays'
import type { FavoriteMeal, Weekday } from '@/common/types/meal'
import { useToastStore } from '@/common/stores/toast.store'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

defineOptions({ name: 'FavoriteCard' })

const props = defineProps<{ favorite: FavoriteMeal }>()
const emit = defineEmits<{ remove: [favoriteId: FavoriteMeal['id']] }>()
const mealPlanStore = useMealPlanStore()
const toastStore = useToastStore()
const day = ref<Weekday>('monday')
const wasAdded = ref(false)
const categoryLabel = computed(
  () => MEAL_CATEGORIES.find(({ value }) => value === props.favorite.defaultCategory)?.label ?? '',
)

watch(day, () => (wasAdded.value = false))

const addToPlan = (): void => {
  mealPlanStore.addMeal({
    dishId: props.favorite.dishId,
    name: props.favorite.name,
    day: day.value,
    category: props.favorite.defaultCategory,
  })
  wasAdded.value = true
  toastStore.showToast(`${props.favorite.name} añadida al plan.`)
}

const removeFavorite = (): void => {
  emit('remove', props.favorite.id)
  toastStore.showToast('Eliminada de favoritos.', 'info')
}
</script>

<template>
  <article class="favorite-card">
    <div class="favorite-card__heading">
      <span class="material-icons-outlined" aria-hidden="true">favorite</span>
      <div>
        <h2>{{ favorite.name }}</h2>
        <p>{{ categoryLabel }}</p>
      </div>
      <button
        class="favorite-card__remove"
        type="button"
        :aria-label="`Eliminar ${favorite.name} de favoritos`"
        @click="removeFavorite"
      >
        <span class="material-icons-outlined" aria-hidden="true">delete_outline</span>
      </button>
    </div>
    <div class="favorite-card__schedule">
      <label :for="`favorite-day-${favorite.id}`">Añadir al plan</label>
      <select :id="`favorite-day-${favorite.id}`" v-model="day">
        <option v-for="option in WEEKDAYS" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <button type="button" :disabled="wasAdded" @click="addToPlan">
        <span class="material-icons-outlined" aria-hidden="true">
          {{ wasAdded ? 'check' : 'add' }}
        </span>
        {{ wasAdded ? 'Añadido' : 'Añadir' }}
      </button>
    </div>
  </article>
</template>

<style scoped src="./FavoriteCard.styles.scss" lang="scss"></style>
