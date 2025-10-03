import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
    id: number
    type: 'error' | 'success' | 'warning' | 'info'
    message: string
    timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
    const notifications = ref<Notification[]>([])

    const addNotification = (notification: Omit<Notification, 'id'>): void => {
        const id = Date.now()
        const newNotification = { ...notification, id }

        notifications.value.push(newNotification)

        // Автоматическое удаление через указанное время
        const timeout = notification.timeout || 3000
        setTimeout(() => {
            removeNotification(id)
        }, timeout)
    }

    const removeNotification = (id: number): void => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
            notifications.value.splice(index, 1)
        }
    }

    const clearAll = (): void => {
        notifications.value = []
    }

    return {
        notifications,
        addNotification,
        removeNotification,
        clearAll
    }
})
