export const TaskController = (taskService) => {
    return {
        // GET /tasks - получить все задачи
        async getAllTasks(req, res) {
            try {
                const tasks = await taskService.getAllTasks()

                // JSON API v1.1 format
                res.json({
                    data: tasks.map(task => ({
                        type: 'tasks',
                        id: task.id,
                        attributes: task
                    }))
                })
            } catch (error) {
                res.status(500).json({
                    errors: [{ title: 'Failed to fetch tasks', detail: error.message }]
                })
            }
        },

        // GET /tasks/:id - получить задачу по ID
        async getTaskById(req, res) {
            try {
                const task = await taskService.getTaskById(req.params.id)

                res.json({
                    data: {
                        type: 'tasks',
                        id: task.id,
                        attributes: task
                    }
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to fetch task', detail: error.message }]
                    })
                }
            }
        },

        // POST /tasks - создать новую задачу
        async createTask(req, res) {
            try {
                const { data: { attributes } } = req.body

                if (!attributes || !attributes.title || !attributes.dueDate) {
                    return res.status(400).json({
                        errors: [{ title: 'Validation failed', detail: 'Title and dueDate are required' }]
                    })
                }

                const task = await taskService.createTask(attributes)

                res.status(201).json({
                    data: {
                        type: 'tasks',
                        id: task.id,
                        attributes: task
                    }
                })
            } catch (error) {
                res.status(400).json({
                    errors: [{ title: 'Failed to create task', detail: error.message }]
                })
            }
        },

        // PUT /tasks/:id - обновить задачу
        async updateTask(req, res) {
            try {
                const { data: { attributes } } = req.body

                const task = await taskService.updateTask(req.params.id, attributes)

                res.json({
                    data: {
                        type: 'tasks',
                        id: task.id,
                        attributes: task
                    }
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(400).json({
                        errors: [{ title: 'Failed to update task', detail: error.message }]
                    })
                }
            }
        },

        // DELETE /tasks/:id - удалить задачу
        async deleteTask(req, res) {
            try {
                await taskService.deleteTask(req.params.id)
                res.status(204).send()
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to delete task', detail: error.message }]
                    })
                }
            }
        }
    }
}
