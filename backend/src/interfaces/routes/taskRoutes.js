import { TaskController } from '../controllers/TaskController.js'
import { TaskService } from '../../application/TaskService.js'
import { TaskRepository } from '../../infrastructure/repositories/TaskRepository.js'
import { createSQLiteDatabase } from '../../infrastructure/database/Database.js'
import { validateTaskData, validateTaskId } from '../middleware/validation.js'

export const createTaskRoutes = async () => {
    const { default: express } = await import('express')
    const router = express.Router()

    try {
        // Инициализация зависимостей
        const db = await createSQLiteDatabase('./tasks.db')
        const taskRepository = TaskRepository(db)
        const taskService = TaskService(taskRepository)
        const taskController = TaskController(taskService)

        // Маршруты
        router.get('/tasks', taskController.getAllTasks)
        router.get('/tasks/:id', validateTaskId, taskController.getTaskById)
        router.post('/tasks', validateTaskData, taskController.createTask)
        router.put('/tasks/:id', validateTaskId, validateTaskData, taskController.updateTask)
        router.delete('/tasks/:id', validateTaskId, taskController.deleteTask)

        console.log('✅ Task routes initialized')

        return router
    } catch (error) {
        console.error('❌ Failed to initialize task routes:', error)
        throw error
    }
}
