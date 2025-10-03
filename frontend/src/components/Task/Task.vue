<template>
  <table class="task">

    <thead class="task__head">
    <tr>
      <th>
        <div class="task__head-text">
          <span>ИД</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Название</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Описание</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Статус</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Вложение</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Дата завершения</span>
          <SortIcon/>
        </div>
      </th>
      <th>
        <div class="task__head-text">
          <span>Ответственный</span>
          <SortIcon/>
        </div>
      </th>
      <th></th>
    </tr>
    </thead>

    <tbody class="task__body">
    <template v-for="(task, i) in tasks">
      <tr>
        <td>
          <div class="task__body-check">
            <input name="id" type="checkbox" disabled/>
            <span>{{ i + 1 }}</span>
          </div>
        </td>
        <td>{{ task.title }}</td>
        <td>{{ task.description }}</td>
        <td>
          <div
              :class="{
                'task__body-status--pending': task.status === 'pending',
                'task__body-status--in-progress': task.status === 'in-progress',
                'task__body-status--completed': task.status === 'completed',
              }"
              class="task__body-status">
            {{ status[task.status] }}
          </div>
        </td>
        <td>
          <template
              v-if="task.documents.length"
              v-for="(doc, i) in task.documents"
          >
            {{ task.documents.length - 1 === i ? doc.name : `${doc.name}, ` }}
          </template>
        </td>
        <td>{{ useGetDate(task.dueDate) }}</td>
        <td>{{ task.responsible }}</td>
        <td>
          <div class="task__body-nav">
            <router-link :to="`/tasks/${task.id}`">
              <EyeIcon/>
            </router-link>
            <router-link :to="`/tasks/${task.id}/edit`">
              <PencilIcon/>
            </router-link>
            <button @click="handleDeleteTask(task, i+1)">
              <DeleteIcon/>
            </button>
          </div>
        </td>
      </tr>
    </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import SortIcon from "@/components/UI/Icon/Sort.vue"
import EyeIcon from "@/components/UI/Icon/Eye.vue"
import PencilIcon from "@/components/UI/Icon/Pencil.vue"
import DeleteIcon from "@/components/UI/Icon/Delete.vue"
import { useModals } from '@/composables/useModals'
import type { ITask } from '@/types/task'
import useGetDate from "@/composables/useGetDate.ts"
import { useTaskStore } from "@/stores/taskStore.ts"

const { confirmDelete, deleteSuccess } = useModals()

interface Props {
  tasks: ITask[]
}

const props = defineProps<Props>()
const taskStore = useTaskStore()

const status = {
  'pending': 'В процессе',
  'in-progress': 'Новая',
  'completed': 'Готово'
}

const handleDeleteTask = async (task: ITask, num: number): Promise<void> => {
  const confirmed = await confirmDelete(num)

  if (confirmed) {
    try {
      await taskStore.deleteTask(task.id)
      await deleteSuccess()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}
</script>

<style lang="scss">
@use "Task";
</style>
