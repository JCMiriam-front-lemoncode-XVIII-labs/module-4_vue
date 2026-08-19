<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { ToastVariant } from '@/common/stores/toast.store'
import { useToastStore } from '@/common/stores/toast.store'

defineOptions({ name: 'ToastContainer' })

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
const iconByVariant: Record<ToastVariant, string> = {
  success: 'check_circle',
  error: 'error',
  info: 'info',
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup class="toast-container" name="toast" tag="div" aria-live="polite">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.variant}`"
        role="status"
      >
        <span class="material-icons-outlined toast__icon" aria-hidden="true">
          {{ iconByVariant[toast.variant] }}
        </span>
        <p>{{ toast.message }}</p>
        <button
          type="button"
          aria-label="Cerrar notificación"
          @click="toastStore.removeToast(toast.id)"
        >
          <span class="material-icons-outlined" aria-hidden="true">close</span>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped src="./ToastContainer.styles.scss" lang="scss"></style>
