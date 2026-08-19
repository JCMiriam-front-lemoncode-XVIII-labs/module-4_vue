<script setup lang="ts">
import type { Meal } from '@/common/types/meal'
import MealItem from '@/features/meal-plan/components/meal-item/MealItem.vue'

defineOptions({ name: 'MealList' })

defineProps<{
  meals: Meal[]
}>()

const emit = defineEmits<{
  remove: [mealId: Meal['id']]
}>()
</script>

<template>
  <ul class="meal-list">
    <MealItem v-for="meal in meals" :key="meal.id" :meal="meal" @remove="emit('remove', $event)" />
  </ul>
</template>

<style scoped src="./MealList.styles.scss" lang="scss"></style>
