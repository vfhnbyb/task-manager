<template>
  <div class="step-basic-info">
    <div class="step-basic-info__title title">
      <h3>Основные настройки</h3>
    </div>

    <div class="step-basic-info__form form">
      <div class="form__item">
        <label class="form__item-label" :class="{ 'form__item-label--error': errors.title }">
          <span class="form__item-title">Название</span>
          <input
              :disabled="isViewMode"
              v-model="localTitle"
              name="title"
              class="form__item-input"
              placeholder="Введите значение"
              type="text"
              @input="emitFieldChange"
          />
          <span v-if="errors.title" class="form__item-error">Обязательное поле</span>
        </label>
      </div>

      <div class="form__item">
        <label class="form__item-label">
          <span class="form__item-title">Описание</span>
          <textarea
              v-model="localDescription"
              :disabled="isViewMode"
              name="description"
              class="form__item-textarea"
              placeholder="Введите значение"
              @input="emitFieldChange"
          ></textarea>
        </label>
      </div>

      <div class="form__item">
        <label class="form__item-label form__item-label--picker" :class="{ 'form__item-label--error': errors.dueDate }">
          <span class="form__item-title">Дата завершения (выполнить до:)</span>
          <input
              class="form__item-input form__item-input--picker"
              :disabled="isViewMode"
              v-maska="maskOptional"
              placeholder="Введите значение"
              v-model="localDueDate"
              @update:model-value="emitFieldChange"
          >
          <span v-if="errors.dueDate" class="form__item-error">{{ errors.dueDate }}</span>
        </label>
      </div>

      <div class="form__item">
        <label class="form__item-label">
          <span class="form__item-title">Ответственный</span>
          <input
              :disabled="isViewMode"
              v-model="localResponsible"
              name="responsible"
              class="form__item-input"
              placeholder="Введите имя или фамилию"
              type="text"
              @input="emitFieldChange"
          />
        </label>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vMaska } from "maska/vue"

interface Props {
  title: string
  description: string
  dueDate: string
  status: string
  responsible: string
  mode: 'create' | 'edit' | 'view'
  errors: Record<string, string>
}

interface Emits {
  (e: 'update:title', value: string): void
  (e: 'update:description', value: string): void
  (e: 'update:dueDate', value: string): void
  (e: 'update:responsible', value: string): void
  (e: 'update:status', value: string): void
  (e: 'field-changed'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const maskOptional = {
  mask: 'Dd.Mm.2025 Hh:Ss',
  tokens: {
    D: { pattern: /[0-3]/ },
    d: { pattern: /[0-9]/ },
    M: { pattern: /[0-1]/ },
    m: { pattern: /[0-9]/ },
    H: { pattern: /[0-2]/ },
    h: { pattern: /[0-9]/ },
    S: { pattern: /[0-5]/ },
    s: { pattern: /[0-9]/ },
  }
}

const localTitle = computed({
  get: () => props.title,
  set: (value) => emit('update:title', value)
})

const localDescription = computed({
  get: () => props.description,
  set: (value) => emit('update:description', value)
})

const localDueDate = computed({
  get: () => props.dueDate,
  set: (value) => emit('update:dueDate', value)
})

const localStatus = computed({
  get: () => props.status,
  set: (value) => emit('update:status', value)
})

const localResponsible = computed({
  get: () => props.responsible,
  set: (value) => emit('update:responsible', value)
})

const isViewMode = computed(() => props.mode === 'view')

const emitFieldChange = (): void => {
  emit('field-changed')
}
</script>

<style lang="scss">
@use "StepBasicInfo";
</style>
