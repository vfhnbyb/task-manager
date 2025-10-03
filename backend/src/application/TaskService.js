import { Task } from '../domain/Task.js'

export const TaskService = (taskRepository) => {
    return {
        async getAllTasks() {
            try {
                return await taskRepository.findAll()
            } catch (error) {
                throw new Error(`Service: Failed to get tasks - ${error.message}`)
            }
        },

        async getTaskById(id) {
            const task = await taskRepository.findById(id)
            if (!task) {
                throw new Error(`Task with id ${id} not found`)
            }
            return task
        },

        async createTask(taskData) {
            try {
                const task = Task.create(taskData)
                return await taskRepository.create(task)
            } catch (error) {
                throw new Error(`Service: Failed to create task - ${error.message}`)
            }
        },

        async updateTask(id, updateData) {
            try {
                const existingTask = await taskRepository.findById(id)
                if (!existingTask) {
                    throw new Error(`Task with id ${id} not found`)
                }

                const updatedTask = Task.update(existingTask, updateData)
                return await taskRepository.update(id, updatedTask)
            } catch (error) {
                throw new Error(`Service: Failed to update task - ${error.message}`)
            }
        },

        async deleteTask(id) {
            try {
                const existingTask = await taskRepository.findById(id)
                if (!existingTask) {
                    throw new Error(`Task with id ${id} not found`)
                }

                await taskRepository.delete(id)
            } catch (error) {
                throw new Error(`Service: Failed to delete task - ${error.message}`)
            }
        }
    }
}
