import { validateTask } from './validators.js'
import { TaskStatus } from './interfaces.js'

export const Task = {
    create(data) {
        const task = {
            id: crypto.randomUUID(),
            title: data.title?.trim() || '',
            description: data.description?.trim() || '',
            responsible: data.responsible,
            status: data.status || TaskStatus.PENDING,
            dueDate: data.dueDate,
            documents: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        validateTask(task)
        return task
    },

    update(task, updates) {
        const updatedTask = {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
        }

        if (updatedTask.title) updatedTask.title = updatedTask.title.trim()
        if (updatedTask.description !== undefined) {
            updatedTask.description = updatedTask.description.trim()
        }

        validateTask(updatedTask)
        return updatedTask
    },

    isOverdue(task) {
        return new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
    },

    canChangeStatus(task, newStatus) {
        const rules = {
            [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
            [TaskStatus.IN_PROGRESS]: [TaskStatus.PENDING, TaskStatus.COMPLETED],
            [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS]
        }

        return rules[task.status]?.includes(newStatus) || false
    }
}
