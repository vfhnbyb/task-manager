import { Comment } from '../domain/Comment.js'

export const CommentService = (commentRepository, taskRepository) => {
    return {
        async getTaskComments(taskId) {
            // Проверяем существование задачи
            const task = await taskRepository.findById(taskId)
            if (!task) {
                throw new Error(`Task with id ${taskId} not found`)
            }

            return await commentRepository.findByTaskId(taskId)
        },

        async createComment(taskId, commentData) {
            // Проверяем существование задачи
            const task = await taskRepository.findById(taskId)
            if (!task) {
                throw new Error(`Task with id ${taskId} not found`)
            }

            const comment = Comment.create(commentData, taskId)
            return await commentRepository.create(comment)
        },

        async updateComment(id, updateData) {
            const existingComment = await commentRepository.findById(id)
            if (!existingComment) {
                throw new Error(`Comment with id ${id} not found`)
            }

            const updatedComment = Comment.update(existingComment, updateData)
            return await commentRepository.update(id, updatedComment)
        },

        async deleteComment(id) {
            const existingComment = await commentRepository.findById(id)
            if (!existingComment) {
                throw new Error(`Comment with id ${id} not found`)
            }

            await commentRepository.delete(id)
        }
    }
}
