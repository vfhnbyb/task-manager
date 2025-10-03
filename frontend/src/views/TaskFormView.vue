<template>
  <div class="task-form">
    <div class="task-form__title title">
      <h2>{{ pageTitle }}</h2>
    </div>

    <div class="task-form__nav">
      <div class="task-form__nav-steps">
        <template v-for="step in steps" :key="step.id">
          <button class="task-form__nav-steps-btn"
                  :class="{
                    'task-form__nav-steps-btn--active': currentStep === step.id,
                    'task-form__nav-steps-btn--done': completedSteps.includes(step.id) && currentStep !== step.id,
                    'task-form__nav-steps-btn--disable': !canNavigateToStep(step.id)
                  }"
                  @click="navigateToStep(step.id)"
                  :disabled="!canNavigateToStep(step.id)"
          >
            {{ step.number }}. {{ step.label }}
          </button>
        </template>
      </div>

      <div class="task-form__nav-options">
        <button
            v-if="currentStep > 1"
            class="task-form__nav-options-btn"
            @click="previousStep"
            :disabled="isSaving"
        >
          <ArrowLeftIcon/>
          <span>Назад</span>
        </button>

        <button
            v-if="currentStep < totalSteps"
            class="task-form__nav-options-btn"
            @click="nextStep"
            :disabled="!canProceedToNextStep || isSaving"
        >
          <ArrowRightIcon/>
          <span>Далее</span>
        </button>

        <button
            v-if="!isViewing"
            class="task-form__nav-options-btn"
            @click="handleSave"
            :disabled="isSaving || !isStep1Valid || isViewing || !hasUnsavedChanges"
        >
          <CheckIcon/>
          <template v-if="taskStore.isLoading">
            <span class="spinner"></span>
          </template>

          <template v-else>
            <span>Сохранить</span>
          </template>
        </button>
        <button
            v-if="isCreating || isEditing"
            @click="handleCancel"
            :disabled="!hasUnsavedChanges"
            class="task-form__nav-options-btn task-form__nav-options-btn--color"
        >
          <CheckIcon/>
          <span>Отменить</span>
        </button>
      </div>

      <div class="task-form__content">
        <StepBasicInfo
            v-if="currentStep === 1"
            v-model:title="formData.title"
            v-model:description="formData.description"
            v-model:dueDate="formData.dueDate"
            v-model:responsible="formData.responsible"
            v-model:status="formData.status"
            :mode="mode"
            :errors="errors"
            @field-changed="handleFieldChange"
        />
        <StepDocuments
            v-if="currentStep === 2"
            :task-id="taskId"
            :documents="documents || []"
            @document-uploaded="handleDocumentUploaded"
            @document-deleted="handleDocumentDeleted"
            :mode="mode"
        />
        <StepComments
            v-if="currentStep === 3"
            :task-id="taskId"
            :comments="comments || []"
            @comment-added="handleCommentAdded"
            @comment-updated="handleCommentUpdated"
            @comment-deleted="handleCommentDeleted"
            :mode="mode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowRightIcon from "@/components/UI/Icon/ArrowRight.vue"
import ArrowLeftIcon from "@/components/UI/Icon/ArrowLeft.vue"
import CheckIcon from "@/components/UI/Icon/Check.vue"
import StepBasicInfo from "@/components/TaskForm/StepBasicInfo/StepBasicInfo.vue"
import StepDocuments from "@/components/TaskForm/StepDocuments/StepDocuments.vue"
import StepComments from "@/components/TaskForm/StepComments/StepComments.vue"
import {computed, onMounted, ref, watch} from "vue"
import {onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter} from 'vue-router'
import {useModals} from '@/composables/useModals'
import type {IComment, IDocument, ITask, TaskFormProps} from "@/types/task.ts"
import {useTaskStore} from "@/stores/taskStore.ts"
import useGetDate from "@/composables/useGetDate.ts"
import useConvertToISO from "@/composables/useConvertToISO.ts";
import {useNotifications} from "@/composables/useNotifications.ts"

const route = useRoute()
const router = useRouter()
const {confirm} = useModals()

const props = defineProps<TaskFormProps>()

const taskStore = useTaskStore()
const {showError, showSuccess} = useNotifications()

const currentStep = ref(1)
const isSaving = ref(false)
const errors = ref<Record<string, string>>({})
const hasUnsavedChanges = ref(false)

const formData = ref({
  title: '',
  description: '',
  dueDate: '',
  responsible: '',
  status: 'in-progress' as const
})

const localDocs = ref<File[] | null>(null)

// Исходные данные для отслеживания изменений
const originalFormData = ref({
  title: '',
  description: '',
  dueDate: '',
  responsible: '',
  status: 'in-progress' as const
})

const optionsDialogCancel = {
  title: 'Несохраненные изменения',
  message: 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти? Изменения будут потеряны.',
  confirmText: 'Уйти',
  cancelText: 'Остаться',
  type: 'default'
}

const documents = ref<IDocument[]>()
const comments = ref<IComment[]>()

const taskId = computed(() => props.mode !== 'create' ? route.params.id as string : null)
const isEditing = computed(() => props.mode === 'edit')
const isViewing = computed(() => props.mode === 'view')
const isCreating = computed(() => props.mode === 'create')

const pageTitle = computed(() => {
  switch (props.mode) {
    case 'create':
      return 'Создание задачи'
    case 'edit':
      return 'Редактирование задачи'
    case 'view':
      return 'Просмотр задачи'
    default:
      return 'Задача'
  }
})

const steps = computed(() => [
  {id: 1, number: 1, label: 'Основные настройки'},
  {id: 2, number: 2, label: 'Документы к заданию'},
  {id: 3, number: 3, label: 'Комментарии'}
])

const totalSteps = computed(() => steps.value.length)

const completedSteps = computed(() => {
  const completed: number[] = []
  if (isStep1Valid.value) completed.push(1)
  if (taskId.value) completed.push(2, 3)
  return completed
})

const isStep1Valid = computed(() => {
  return formData.value.title.trim().length > 0 && formData.value.dueDate.length > 0
})

const canProceedToNextStep = computed(() => {
  if (currentStep.value === 1) return isStep1Valid.value
  return true
})

const canNavigateToStep = (stepId: number): boolean => {
  if (isViewing.value || isEditing.value) return true
  if (stepId === 1) return true
  return isStep1Valid.value
}

const nextStep = (): void => {
  if (currentStep.value < totalSteps.value && canProceedToNextStep.value) {
    currentStep.value++
  }
}

const previousStep = (): void => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const navigateToStep = (stepId: number): void => {
  if (canNavigateToStep(stepId)) {
    currentStep.value = stepId
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.title.trim()) {
    errors.value.title = 'Название задачи обязательно'
  }

  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Дата завершения обязательна'
  } else if (useConvertToISO(formData.value.dueDate) < new Date()) {
    errors.value.dueDate = 'Дата завершения не может быть в прошлом'
  }

  return Object.keys(errors.value).length === 0
}

const handleSave = async (): Promise<void> => {
  if (!validateForm()) {
    currentStep.value = 1
    return
  }

  isSaving.value = true

  try {
    const taskData = {
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      dueDate: useConvertToISO(formData.value.dueDate),
      responsible: formData.value.responsible.trim(),
      status: formData.value.status
    }

    if (isCreating.value) {
      const newTask = await taskStore.createTask(taskData)
      hasUnsavedChanges.value = false

      if (taskStore.localFiles) {
        for (const file of Array.from(taskStore.localFiles)) {
          await taskStore.uploadDocument(newTask.id, file)
        }
        taskStore.unsetLocalFile()
      }

      if (taskStore.localComments.length) {
        for (const comment of taskStore.localComments) {
          await taskStore.addComment(newTask.id, comment)
        }

        taskStore.unsetLocalComments()
      }

      await router.push(`/tasks`)

    } else if (isEditing.value && taskId.value) {
      await taskStore.updateTask(taskId.value, taskData)
      hasUnsavedChanges.value = false
    }

  } catch (error) {
    showError('Failed to save task')
  } finally {
    isSaving.value = false
  }
}

const handleCancel = async (): Promise<void> => {
  if (hasUnsavedChanges.value) {
    const confirmed = await confirm({
      title: 'Подтверждение отмены',
      message: 'У вас есть несохраненные изменения. Вы уверены, что хотите отменить?',
      confirmText: 'Да',
      cancelText: 'Продолжить',
      type: 'default'
    })

    if (!confirmed) return
  }

  hasUnsavedChanges.value = false
  await router.push('/tasks')
}

const handleFieldChange = (): void => {
  checkUnsavedChanges()
}

// Вопрос: зачем? А ясам не придумал, но пусть пока будет
const handleDocumentUploaded = () => {
  console.log('handleDocumentUploaded')
}

// Вопрос: зачем? А ясам не придумал, но пусть пока будет
const handleDocumentDeleted = () => {
  console.log('handleDocumentDeleted')
}

// Вопрос: зачем? А ясам не придумал, но пусть пока будет
const handleCommentAdded = () => {
  console.log('handleCommentAdded')
}

// Вопрос: зачем? А ясам не придумал, но пусть пока будет
const handleCommentUpdated = () => {
  console.log('handleCommentUpdated')
}

// Вопрос: зачем? А ясам не придумал, но пусть пока будет
const handleCommentDeleted = () => {
  console.log('handleCommentDeleted')
}

// Загрузка данных задачи при редактировании/просмотре
const loadTaskData = async (): Promise<void> => {
  if (!taskId.value) return

  try {
    const task = await taskStore.fetchTask(taskId.value)
    documents.value = task.documents
    comments.value = task.comments

    formData.value = {
      title: task.title,
      description: task.description,
      dueDate: useGetDate(task.dueDate),
      responsible: task.responsible || '',
      status: task.status
    }

    // Сохраняем исходные данные для отслеживания изменений
    originalFormData.value = {...formData.value}
  } catch (error) {
    console.error('Failed to load task:', error)
    await router.push('/')
  }
}

// Навигационные хуки
onBeforeRouteLeave(async (to, from, next) => {
  // В режиме просмотра всегда разрешаем переход
  if (props.mode === 'view' || !hasUnsavedChanges.value) {
    next()
    return
  }

  try {
    const confirmed = await confirm(optionsDialogCancel)

    next(confirmed)
  } catch (error) {
    console.error('Error in navigation guard:', error)
    next(false)
  }
})

const checkUnsavedChanges = (): void => {
  if (isCreating.value) {
    hasUnsavedChanges.value = formData.value.title.trim().length > 0 ||
        formData.value.description.trim().length > 0 ||
        formData.value.dueDate.length > 0 ||
        formData.value.responsible.trim().length > 0
  } else if (isEditing.value) {
    hasUnsavedChanges.value =
        formData.value.title !== originalFormData.value.title ||
        formData.value.description !== originalFormData.value.description ||
        formData.value.dueDate !== originalFormData.value.dueDate ||
        formData.value.responsible !== originalFormData.value.responsible ||
        formData.value.status !== originalFormData.value.status
  } else {
    hasUnsavedChanges.value = false
  }
}

onBeforeRouteUpdate(async (to, from, next) => {
  // В режиме просмотра всегда разрешаем переход
  if (props.mode === 'view' || !hasUnsavedChanges.value) {
    next()
    return
  }

  try {
    const confirmed = await confirm(optionsDialogCancel)

    next(confirmed)
  } catch (error) {
    console.error('Error in navigation guard:', error)
    next(false)
  }
})

onMounted(() => {
  if (taskId.value) {
    loadTaskData()
  }
})

// Отслеживание изменений формы - только в режимах create/edit
watch(formData, (newValue) => {
  if (props.mode !== 'view') {
    checkUnsavedChanges()
  }
}, {deep: true})

watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTaskData()
  }
})
</script>

<style lang="scss">
.task-form {
  &__title {
    margin-bottom: 24px;
  }

  &__nav {
    &-steps {
      display: flex;
      gap: 2px;
      padding-left: 8px;

      &-btn {
        display: flex;
        min-width: 214px;
        padding: 10px 24px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 8px 8px 0 0;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 24px; /* 150% */
        transition: background-color .3s;


        border-top: 1px solid #CFD5D9;
        border-right: 1px solid #CFD5D9;
        border-left: 1px solid #CFD5D9;
        background: #F6F6F6;
        color: #6A6D71;


        &--active {
          color: white;
          background-color: #174A87;
        }

        &--disable, :disabled {
          border-radius: 8px 8px 0 0;
          border-top: 1px solid #CFD5D9;
          border-right: 1px solid #CFD5D9;
          border-left: 1px solid #CFD5D9;
          background-color: #F6F6F6;
          color: #C6CACF;
        }

        &--done {
          color: white;
          background-color: #3E72B0;
        }
      }
    }

    &-options {
      display: flex;
      padding: 24px;
      border-radius: 12px;
      background-color: #F6F6F6;
      border: 1px solid #CFD5D9;
      gap: 12px;


      &-btn {
        display: flex;
        height: 40px;
        padding: 10px 14px;
        justify-content: center;
        align-items: center;
        gap: 8px;

        border-radius: 6px;
        border: 1px solid #CFD5D9;
        background-color: #FCFCFC;

        span {
          margin-top: 3px;
        }

        &--color {
          border: 1px solid #174A87;
          background-color: #174A87;
          color: white;

          svg {
            path {
              fill: white;
            }
          }
        }

        &:disabled {
          border: 1px solid #CFD5D9;
          background-color: #EDEDEE;
          color: #C6CACF;

          svg {
            path {
              fill: #BBC0C5
            }
          }
        }
      }
    }
  }
}
</style>
