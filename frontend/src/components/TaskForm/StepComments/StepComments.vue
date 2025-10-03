<template>
  <div class="step-comments">
    <div class="step-comments__title title">
      <h3>Комментарии к заданию</h3>
    </div>

    <div class="step-comments__content">
      <div v-if="displayedComments.length" class="step-comments__items">
        <template v-for="item in displayedComments">
          <div class="step-comments__item">
            <div class="step-comments__item-header">
              <div class="step-comments__item-header-avatar">{{ getInitials(item.author) }}</div>
              <div class="step-comments__item-header-name">{{ item.author }}, {{ useGetDate(item.createdAt) }}</div>
            </div>
            <div class="step-comments__item-comment">
              <p>{{ item.content }}</p>
            </div>
            <div class="step-comments__item-footer">
              <a
                  v-if="!editedComment || editedComment.id !== item.id"
                  @click.prevent="editComment(item)"
                  href="">
                Редактировать
              </a>
              <a
                  v-else-if="editedComment?.id === item.id"
                  @click.prevent="cancelCommentEdit()"
                  href="">
                Отмена редактирования
              </a>
              <a @click.prevent="handleDeleteComment(item.id)" href="">Удалить</a>
            </div>
          </div>
        </template>
      </div>

      <div class="step-comments__empty" v-else>
        <p>Нет комментариев</p>
      </div>

      <div class="step-comments__form form">
        <div class="form__item">
          <label class="form__item-label">
            <span class="form__item-title">Комментарий</span>
            <textarea v-model="comment" name="comment" class="form__item-textarea"
                      placeholder="Введите значение"></textarea>
          </label>
        </div>

        <button v-if="!editedComment" @click="addComments" class="step-comments__form-btn btn btn-outline">Добавить
        </button>
        <button v-else @click="saveComment" class="step-comments__form-btn btn btn-outline">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from "vue"
import type {IComment} from "@/types/task.ts"
import useGetDate from "@/composables/useGetDate.ts"
import {useModals} from "@/composables/useModals.ts"

const {confirmDeleteComment} = useModals()
import {useTaskStore} from "@/stores/taskStore.ts"
import {useNotifications} from "@/composables/useNotifications.ts"

interface Props {
  taskId?: string
  comments: IComment[]
  mode: 'create' | 'edit' | 'view'
}

interface Emits {
  (e: 'comment-added', comment: Comment): void

  (e: 'comment-updated', comment: Comment): void

  (e: 'comment-deleted', commentId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const taskStore = useTaskStore()
const localComments = reactive({
  items: [] as IComment[]
})

const {showError, showSuccess} = useNotifications()

const comment = ref<string>('')
const editedComment = ref<IComment | null>(null)

const displayedComments = computed(() =>
    props.taskId ? props.comments || [] : taskStore.localComments
)

const addComments = async (): IComment => {
  if (!comment.value) return

  try {
    if (!props.taskId) {
      taskStore.addLocalComment({
        id: taskStore.localComments.length + 1,
        author: 'Иванов Иван Иванович',
        content: comment.value,
        createdAt: new Date()
      })
    } else {
      await taskStore.addComment(props.taskId, {
        author: taskStore.currentTask.responsible || 'Иванов Иван Иванович',
        content: comment.value
      })
    }

    comment.value = ''
  } catch (e) {
    showError('Filed add comment')
  }
}

const editComment = (item: IComment) => {
  comment.value = item.content
  editedComment.value = item
}

const cancelCommentEdit = () => {
  editedComment.value = null
  comment.value = ''
}

const saveComment = async () => {
  try {
    if (!props.taskId) {
      taskStore.updateLocalComment(editedComment.value.id, comment.value)
    } else {
      await taskStore.updateComment(editedComment.value.id, {
        author: taskStore.currentTask.responsible || 'Иванов Иван Иванович',
        content: comment.value
      })
    }

    editedComment.value = null
    comment.value = ''
  } catch (error) {
    showError('Failed to add comment')
  }
}

const handleDeleteComment = async (id: string = ''): Promise<void> => {
  const confirmed = await confirmDeleteComment()

  if (confirmed) {
    try {
      if (!props.taskId) {
        const cid = taskStore.localComments.findIndex(row => row.id === id)
        taskStore.deleteLocalComment(cid)
      } else {
        await taskStore.deleteComment(id)
      }

    } catch (error) {
      showError('Failed to delete comment')
    }
  }
}

const getInitials = (fullName: string): string => {
  if (!fullName) return ''
  const names = fullName.trim().split(/\s+/).filter(name => name.length > 0)
  if (names.length === 0) return ''
  const firstInitial = names[0][0]?.toUpperCase() || ''
  if (names.length === 1) return firstInitial
  const secondInitial = names[1][0]?.toUpperCase() || ''

  return firstInitial + secondInitial
}

function getRandomInRange(min = 9999, max = 9999999) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
</script>

<style lang="scss">
@use "StepComments";
</style>
