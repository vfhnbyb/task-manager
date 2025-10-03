<template>
  <div>
    <router-link to="/tasks/new" class="btn btn-color task__btn">
      <PlusIcon />
      Создать задание
    </router-link>

    <div class="divider"></div>

    <Task :tasks="taskStore.tasks" />

  </div>
</template>

<script setup lang="ts">
import PlusIcon from "@/components/UI/Icon/Plus.vue"
import Task from "@/components/Task/Task.vue"
import { onMounted } from "vue"
import { useTaskStore } from "@/stores/taskStore.ts"

const taskStore = useTaskStore()

onMounted(async () => {
  try {
    await taskStore.fetchTasks()
  } catch (error) {
    console.error('Failed to load tasks:', error)
  }
})
</script>

<style lang="scss">
.task__btn {
  max-width: 176px;
}
</style>
