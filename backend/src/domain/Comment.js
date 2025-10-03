import { validateComment } from './validators.js'

export const Comment = {
    create(data, taskId) {
        const comment = {
            id: crypto.randomUUID(),
            taskId: taskId,
            author: data.author?.trim() || '',
            content: data.content?.trim() || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        validateComment(comment)
        return comment
    },

    update(comment, updates) {
        const updatedComment = {
            ...comment,
            ...updates,
            updatedAt: new Date().toISOString()
        }

        if (updatedComment.author) updatedComment.author = updatedComment.author.trim()
        if (updatedComment.content !== undefined) {
            updatedComment.content = updatedComment.content.trim()
        }

        validateComment(updatedComment)
        return updatedComment
    }
}
