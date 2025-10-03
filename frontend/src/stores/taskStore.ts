import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type {ITask, IDocument, TaskCreateData, TaskUpdateData, IComment} from '@/types/task'
import { taskApi, documentApi, commentApi } from '@/services/api'
import { useNotificationStore } from './notification'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<ITask[]>([])
    const currentTask = ref<ITask | null>(null)
    const isLoading = ref<boolean>(false)

    const localFiles = ref<File[]>([])
    const localComments = ref<IComment[]>([])

    const notificationStore = useNotificationStore()

    // Геттеры
    const pendingTasks = computed(() =>
        tasks.value.filter(task => task.status === 'pending')
    )

    const inProgressTasks = computed(() =>
        tasks.value.filter(task => task.status === 'in-progress')
    )

    const completedTasks = computed(() =>
        tasks.value.filter(task => task.status === 'completed')
    )

    const taskCounts = computed(() => ({
        total: tasks.value.length,
        pending: pendingTasks.value.length,
        inProgress: inProgressTasks.value.length,
        completed: completedTasks.value.length
    }))

    // Действия
    const addLocalFile = (file: File[]) => {
        localFiles.value.push(file)
    }

    const deleteLocalFile = (sid: number) => {
        localFiles.value.splice(sid, 1)
    }

    const unsetLocalFile = () => {
        localFiles.value = []
    }

    const addLocalComment = (comment: IComment) => {
        localComments.value.push(comment)
    }

    const updateLocalComment = (id: string, content: string) => {
        const cid = localComments.value.findIndex(row => row.id === id)

        if (cid >= 0) {
            localComments.value[cid].content = content
        }
    }

    const deleteLocalComment = (sid: number) => {
        localComments.value.splice(sid, 1)
    }

    const unsetLocalComments = () => {
      localComments.value = []
    }

    const fetchTasks = async (): Promise<void> => {
        isLoading.value = true

        try {
            tasks.value = await taskApi.getAll()
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchTask = async (id: string): Promise<ITask> => {
        isLoading.value = true

        try {
            currentTask.value = await taskApi.getById(id)
            return currentTask.value
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Unknown error'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const createTask = async (taskData: TaskCreateData): Promise<ITask> => {
        isLoading.value = true

        try {
            const newTask = await taskApi.create(taskData)
            tasks.value.unshift(newTask)
            return newTask
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })

            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateTask = async (id: string, taskData: TaskUpdateData): Promise<ITask> => {
        isLoading.value = true

        try {
            const updatedTask = await taskApi.update(id, taskData)
            const index = tasks.value.findIndex(task => task.id === id)
            if (index !== -1) {
                tasks.value[index] = updatedTask
            }
            if (currentTask.value && currentTask.value.id === id) {
                currentTask.value = updatedTask
            }
            return updatedTask
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteTask = async (id: string): Promise<void> => {
        isLoading.value = true

        try {
            await taskApi.delete(id)
            tasks.value = tasks.value.filter(task => task.id !== id)
            if (currentTask.value && currentTask.value.id === id) {
                currentTask.value = null
            }
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const uploadDocument = async (taskId: string, file: File): Promise<IDocument> => {
        try {
            const document = await documentApi.upload(taskId, file)
            if (currentTask.value && currentTask.value.id === taskId) {
                if (!currentTask.value.documents) {
                    currentTask.value.documents = []
                }
                currentTask.value.documents.push(document)
            }
            return document
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        }
    }

    const deleteDocument = async (documentId: string): Promise<void> => {
        try {
            await documentApi.delete(documentId)

            if (!currentTask.value?.documents) return
            const index = currentTask.value.documents.findIndex(doc => doc.id === documentId)

            if (index >= 0) {
                currentTask.value.documents.splice(index, 1)
            }

        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        }
    }

    const addComment = async (taskId: string, commentData: CommentCreateData): Promise<IComment> => {
        try {
            isLoading.value = true


            const comment = await commentApi.create(taskId, commentData)

            if (currentTask.value && currentTask.value.id === taskId) {
                if (!currentTask.value.comments) {
                    currentTask.value.comments = []
                }
                currentTask.value.comments.unshift(comment)

                currentTask.value = { ...currentTask.value }
            }

            return comment
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const updateComment = async (commentId: string, commentData: CommentUpdateData): Promise<IComment> => {
        try {
            isLoading.value = true


            const updatedComment = await commentApi.update(commentId, commentData)

            // Обновляем currentTask если он загружен
            if (currentTask.value?.comments) {
                const index = currentTask.value.comments.findIndex(c => c.id === commentId)
                if (index !== -1) {
                    currentTask.value.comments[index] = updatedComment
                    currentTask.value = { ...currentTask.value }
                }
            }

            return updatedComment
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const deleteComment = async (commentId: string): Promise<void> => {
        try {
            isLoading.value = true


            await commentApi.delete(commentId)

            // Обновляем currentTask если он загружен
            if (currentTask.value?.comments) {
                const index = currentTask.value.comments.findIndex(c => c.id === commentId)
                if (index > -1) {
                    currentTask.value.comments.splice(index, 1)
                    currentTask.value = { ...currentTask.value }
                }
            }

        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const fetchTaskComments = async (taskId: string): Promise<IComment[]> => {
        try {
            isLoading.value = true


            const comments = await commentApi.getByTaskId(taskId)

            // Обновляем currentTask если он загружен
            if (currentTask.value && currentTask.value.id === taskId) {
                currentTask.value.comments = comments
                currentTask.value = { ...currentTask.value }
            }

            return comments
        } catch (err) {
            notificationStore.addNotification({
                type: 'error',
                message: err instanceof Error ? err.message : 'Unknown error',
                timeout: 3000
            })
            throw err
        } finally {
            isLoading.value = false
        }
    }

    const clearCurrentTask = (): void => {
        currentTask.value = null
    }

    return {
        // State
        tasks: readonly(tasks),
        currentTask: readonly(currentTask),
        isLoading: readonly(isLoading),
        localFiles: readonly(localFiles),
        localComments: readonly(localComments),

        // Getters
        pendingTasks,
        inProgressTasks,
        completedTasks,
        taskCounts,

        //Local Actions
        addLocalFile,
        deleteLocalFile,
        unsetLocalFile,
        addLocalComment,
        updateLocalComment,
        deleteLocalComment,
        unsetLocalComments,

        // Task Actions
        fetchTasks,
        fetchTask,
        createTask,
        updateTask,
        deleteTask,

        // Document Actions
        uploadDocument,
        deleteDocument,

        // Comment Actions
        addComment,
        updateComment,
        deleteComment,
        fetchTaskComments,

        // Utility
        clearCurrentTask
    }
})
