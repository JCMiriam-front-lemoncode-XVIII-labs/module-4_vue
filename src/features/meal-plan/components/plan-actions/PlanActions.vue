<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

import ConfirmationModal from '@/common/components/confirmation-modal/ConfirmationModal.vue'
import type { Meal } from '@/common/types/meal'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'
import { formatWeeklyPlan } from '@/features/meal-plan/utils/format-weekly-plan'

defineOptions({ name: 'PlanActions' })

const props = defineProps<{ meals: Meal[] }>()
const mealPlanStore = useMealPlanStore()
const feedbackMessage = ref('')
const isClearModalOpen = ref(false)

const copyPlan = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(formatWeeklyPlan(props.meals))
    feedbackMessage.value = 'Menú copiado al portapapeles.'
  } catch {
    feedbackMessage.value = 'No se pudo copiar el menú.'
  }
}

const downloadPlan = (): void => {
  const file = new Blob([formatWeeklyPlan(props.meals)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = 'plan-semanal.txt'
  link.click()
  URL.revokeObjectURL(url)
  feedbackMessage.value = 'Menú descargado.'
}

const clearPlan = (): void => {
  mealPlanStore.clearPlan()
  isClearModalOpen.value = false
  feedbackMessage.value = 'Plan semanal vaciado.'
}

const printPlan = (): void => window.print()
</script>

<template>
  <div class="plan-tools">
    <div class="plan-tools__actions" aria-label="Acciones del plan semanal">
      <RouterLink class="plan-tools__primary" :to="{ name: 'meal-create' }">
        <span class="material-icons-outlined" aria-hidden="true">add</span>
        Añadir comida
      </RouterLink>
      <button type="button" :disabled="!meals.length" @click="copyPlan">
        <span class="material-icons-outlined" aria-hidden="true">content_copy</span>
        Copiar
      </button>
      <button type="button" :disabled="!meals.length" @click="downloadPlan">
        <span class="material-icons-outlined" aria-hidden="true">download</span>
        Exportar
      </button>
      <button type="button" :disabled="!meals.length" @click="printPlan">
        <span class="material-icons-outlined" aria-hidden="true">print</span>
        Imprimir
      </button>
      <button
        class="plan-tools__danger"
        type="button"
        :disabled="!meals.length"
        @click="isClearModalOpen = true"
      >
        <span class="material-icons-outlined" aria-hidden="true">delete_sweep</span>
        Vaciar
      </button>
    </div>
    <p v-if="feedbackMessage" class="plan-tools__feedback" role="status">
      {{ feedbackMessage }}
    </p>
    <ConfirmationModal
      :open="isClearModalOpen"
      title="¿Vaciar el plan semanal?"
      description="Se eliminarán todas las comidas planificadas. Los platos del catálogo y tus favoritos se conservarán."
      confirm-label="Sí, vaciar plan"
      @cancel="isClearModalOpen = false"
      @confirm="clearPlan"
    />
  </div>
</template>

<style scoped src="./PlanActions.styles.scss" lang="scss"></style>
