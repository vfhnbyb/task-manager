<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleOverlayClick">
    <div class="modal" role="dialog" aria-labelledby="modal-title">
      <div class="modal__header">
        <h3 id="modal-title" class="modal__title">{{ title }}</h3>
        <button
            class="modal__close"
            @click="close"
            aria-label="Закрыть модальное окно"
        >
          <span class="icon"></span>
        </button>
      </div>

      <div class="modal__body">
        <p class="modal__message">{{ message }}</p>
      </div>

      <div class="modal__footer">
        <button
            class="btn btn-color"
            @click="confirm"
            :disabled="isLoading"
            v-if="type === 'default'"
        >
          <template v-if="isLoading">
            <span  class="spinner"></span>
          </template>

          <template v-else>
            {{ confirmText }}
          </template>
        </button>
        <button
            class="btn"
            :class="type === 'default' ? 'btn-outline' : 'btn-color'"
            @click="close"
            :disabled="isLoading"
        >
          {{ cancelText }}
        </button>
      </div>

      <img v-if="type === 'default'" class="modal__img" src="@/assets/img/cat.png" alt="cat">
      <img v-if="type === 'info'" class="modal__img" src="@/assets/img/happy-cat.png" alt="happy-cat">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ModalConfig } from '@/types/modal'

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const isLoading = ref(false)
const title = ref('Подтверждение действия')
const message = ref('Вы уверены, что хотите выполнить это действие?')
const confirmText = ref('Подтвердить')
const cancelText = ref('Отмена')
const type = ref('default')

let resolvePromise: ((value: boolean) => void) | null = null

const open = async (config: ModalConfig): Promise<boolean> => {
  title.value = config.title
  message.value = config.message
  confirmText.value = config.confirmText || 'Подтвердить'
  cancelText.value = config.cancelText || 'Отмена'

  type.value = config.type

  isOpen.value = true
  isLoading.value = false

  return new Promise<boolean>((resolve) => {
    resolvePromise = resolve
  })
}

const confirm = async (): Promise<void> => {
  isLoading.value = true
  try {
    emit('confirm')
    if (resolvePromise) {
      resolvePromise(true)
    }
  } finally {
    close()
  }
}

const close = (): void => {
  if (resolvePromise) {
    resolvePromise(false)
    resolvePromise = null
  }
  isOpen.value = false
  isLoading.value = false
  emit('cancel')
}

const handleOverlayClick = (event: MouseEvent): void => {
  if (event.target === event.currentTarget) {
    close()
  }
}

// Экспортируем методы для использования извне
defineExpose({
  open,
  close
})
</script>

<style lang="scss">
@use "ConfirmModal";
</style>
