<template>
  <div class="step-documents">
    <div v-if="!isViewMode" class="step-documents__title title">
      <h3>Документы к заданию</h3>
    </div>

    <div class="step-documents__content">
      <div v-if="!isViewMode" class="form">
        <label class="form__item-file">
          <DocumentIcon />
          <span class="form__item-file-title">Перетащите документы сюда</span>
          <span class="form__item-file-text">Перетащите в это поле или выберите файлы в формате pdf, doc, docx, xls</span>
          <input
              @change="handleFileSelect"
              accept=".pdf, .doc, .docx, .xls, .zip"
              multiple name="files" class="form__item-input-file" type="file"/>
          <span class="form__item-file-btn btn btn-color">Выбрать</span>
        </label>
      </div>

      <div class="step-documents__title title">
        <h3>Загруженные файлы</h3>
      </div>

      <div v-if="taskStore.localFiles.length" class="step-documents__docs">
        <template v-for="file in taskStore.localFiles">
          <div class="step-documents__docs-item">
            <DocumentIcon />
            <div class="step-documents__docs-item-name">
              {{ file.name }}
              <span class="step-documents__docs-item-name-size">
                {{ formatFileSize(file.size) }}
              </span>
            </div>
            <button @click="handleDeleteDoc(file.id, file.name)" class="step-documents__docs-item-delete">
              <DeleteIcon />
            </button>
          </div>
        </template>
      </div>

      <div v-if="documents.length" class="step-documents__docs">
        <template v-for="file in documents">
          <div class="step-documents__docs-item">
            <DocumentIcon />
            <div class="step-documents__docs-item-name">
              <a target="_blank" :href="`http://localhost:3001${file.url}`">{{ file.name }}</a>
              <span class="step-documents__docs-item-name-size">
                {{ formatFileSize(file.size) }}
              </span>
            </div>
            <button @click="handleDeleteDoc(file.id, file.name)" class="step-documents__docs-item-delete">
              <DeleteIcon />
            </button>
          </div>
        </template>
      </div>

      <div v-if="!taskStore.localFiles.length && !documents.length" class="step-documents__docs-empty">
        <p>Нет загруженных документов</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue"
import DocumentIcon from "@/components/UI/Icon/Document.vue"
import DeleteIcon from "@/components/UI/Icon/Delete.vue"
import { useModals } from '@/composables/useModals'
import { useTaskStore } from "@/stores/taskStore.ts"
import type { IDocument } from "@/types/task.ts"
import { useNotifications } from "@/composables/useNotifications.ts"

interface Props {
  taskId?: string
  documents: IDocument[]
  mode: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'document-uploaded', document: any): void
  (e: 'document-deleted', documentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { confirmDeleteDoc } = useModals()

const { showError, showSuccess } = useNotifications()

const isViewMode = computed(() => props.mode === 'view')
const isCreating = computed(() => props.mode === 'create')

const taskStore = useTaskStore()

const handleDeleteDoc = async (id: string, name: string = ''): Promise<void> => {
  const confirmed = await confirmDeleteDoc(name)

  if (confirmed) {
    try {
      if (!props.taskId) {
        const sid = taskStore.localFiles.findIndex(row => row.name === name)
        if (sid >= 0) {
          taskStore.deleteLocalFile(sid)
        }
      } else {
        await taskStore.deleteDocument(id)
      }
      emit('document-deleted')
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const validateFiles = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf', // .pdf
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
  ]

  if (file.size > maxSize) {
    showError(`Файл "${file.name}" слишком большой. Максимальный размер: 10MB`)
    return false
  } else if (!allowedTypes.includes(file.type)) {
    showError(`Файл "${file.name}" имеет неподдерживаемый тип`)
    return false
  } else {
    return true
  }
}

const handleFileSelect = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (!files) return

  if (!props.taskId) {
    for (const file of Array.from(files)) {
      if (validateFiles(file)) {
        taskStore.addLocalFile(file)
      }
    }
  } else {
    for (const file of Array.from(files)) {
      if (validateFiles(file)) {
        await uploadDocument(file)
      }
    }
  }

  emit('document-uploaded')

  // Сброс input
  input.value = ''
}

const uploadDocument = async (file: File): Promise<void> => {
  if (!props.taskId) return

  try {
    await taskStore.uploadDocument(props.taskId, file)
  } catch (error) {
    showError('Failed to upload document')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Б'

  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style lang="scss">
@use "StepDocuments";
</style>
