import { inject, type InjectionKey } from 'vue'
import type { ModalConfig, ConfirmModalType } from '@/types/modal'

export const confirmModalKey: InjectionKey<ConfirmModalType> = Symbol('confirmModal')

export function useModals() {
    const confirmModal = inject(confirmModalKey)

    if (!confirmModal) {
        throw new Error('Modal providers not found')
    }

    const confirm = async (config: ModalConfig): Promise<boolean> => {
        return await confirmModal.open(config)
    }

    const confirmDelete = async (id: number = 0): Promise<boolean> => {
        return await confirm({
            title: `Удалить задание №${id}?`,
            message: `Все данные будут удалены без возможности восстановления. Удалить выбранное задание?`,
            confirmText: 'Да',
            cancelText: 'Нет',
            type: 'default'
        })
    }

    const confirmDeleteDoc = async (name: string = ''): Promise<boolean> => {
        return await confirm({
            title: `Удалить документ?`,
            message: `Документ Отчет_по_сотрудникам ${name} будет полностью удалён из системы`,
            confirmText: 'Да',
            cancelText: 'Нет',
            type: 'default'
        })
    }

    const confirmDeleteComment = async (): Promise<boolean> => {
        return await confirm({
            title: `Удалить комментарий?`,
            message: `Уверены, что хотите удалить комментарий?`,
            confirmText: 'Да',
            cancelText: 'Нет',
            type: 'default'
        })
    }

    const deleteSuccess = async (): Promise<boolean> => {
        return await confirm({
            title: `Задание успешно удалено!`,
            message: ``,
            confirmText: null,
            cancelText: 'Хорошо',
            type: 'info'
        })
    }

    return {
        confirm,
        confirmDelete,
        confirmDeleteDoc,
        confirmDeleteComment,
        deleteSuccess
    }
}
