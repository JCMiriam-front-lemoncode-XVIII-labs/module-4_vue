<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

defineOptions({ name: 'ConfirmationModal' })

const props = withDefaults(
  defineProps<{ open: boolean; title: string; description: string; confirmLabel?: string }>(),
  { confirmLabel: 'Confirmar' },
)
const emit = defineEmits<{ cancel: []; confirm: [] }>()
const dialog = ref<HTMLElement>()

const handleKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape' && props.open) emit('cancel')
}

watch(
  () => props.open,
  async (isOpen) => {
    document.removeEventListener('keydown', handleKeydown)
    if (!isOpen) return
    document.addEventListener('keydown', handleKeydown)
    await nextTick()
    dialog.value?.focus()
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="emit('cancel')">
      <section
        ref="dialog"
        class="confirmation-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
        tabindex="-1"
      >
        <span class="confirmation-modal__icon" aria-hidden="true">
          <span class="material-icons-outlined">delete_sweep</span>
        </span>
        <div>
          <h2 id="confirmation-modal-title">{{ title }}</h2>
          <p id="confirmation-modal-description">{{ description }}</p>
        </div>
        <div class="confirmation-modal__actions">
          <button type="button" @click="emit('cancel')">Cancelar</button>
          <button class="confirmation-modal__confirm" type="button" @click="emit('confirm')">
            {{ confirmLabel }}
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped src="./ConfirmationModal.styles.scss" lang="scss"></style>
