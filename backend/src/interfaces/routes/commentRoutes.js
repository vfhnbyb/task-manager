import { CommentController } from '../controllers/CommentController.js'
import { CommentService } from '../../application/CommentService.js'
import { CommentRepository } from '../../infrastructure/repositories/CommentRepository.js'
import { TaskRepository } from '../../infrastructure/repositories/TaskRepository.js'
import { createSQLiteDatabase } from '../../infrastructure/database/Database.js'
import {
    validateCommentData,
    validateTaskIdParam,
    validateCommentId
} from '../middleware/validation.js'

export const createCommentRoutes = async () => {
    const { default: express } = await import('express')
    const router = express.Router()

    try {
        const db = await createSQLiteDatabase('./tasks.db')
        const commentRepository = CommentRepository(db)
        const taskRepository = TaskRepository(db)
        const commentService = CommentService(commentRepository, taskRepository)
        const commentController = CommentController(commentService)

        // Маршруты для комментариев
        router.get('/tasks/:taskId/comments', validateTaskIdParam, commentController.getTaskComments)
        router.post('/tasks/:taskId/comments', validateTaskIdParam, validateCommentData, commentController.createComment)

        router.put('/comments/:id', validateCommentId, validateCommentData, commentController.updateComment)
        router.delete('/comments/:id', validateCommentId, commentController.deleteComment)

        console.log('✅ Comment routes initialized')
        return router
    } catch (error) {
        console.error('❌ Failed to initialize comment routes:', error)
        throw error
    }
}
