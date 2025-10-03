import { useNotificationStore } from '@/stores/notification'

export function useNotifications() {
    const notificationStore = useNotificationStore()

    const showError = (message: string, timeout = 5000) => {
        notificationStore.addNotification({
            type: 'error',
            message,
            timeout
        })
    }

    const showSuccess = (message: string, timeout = 3000) => {
        notificationStore.addNotification({
            type: 'success',
            message,
            timeout
        })
    }

    const showWarning = (message: string, timeout = 4000) => {
        notificationStore.addNotification({
            type: 'warning',
            message,
            timeout
        })
    }

    const showInfo = (message: string, timeout = 3000) => {
        notificationStore.addNotification({
            type: 'info',
            message,
            timeout
        })
    }

    return {
        showError,
        showSuccess,
        showWarning,
        showInfo
    }
}
