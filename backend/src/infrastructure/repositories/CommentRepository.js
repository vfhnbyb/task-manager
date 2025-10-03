export const CommentRepository = (db) => {
    return {
        async findByTaskId(taskId) {
            try {
                const comments = await db.all(
                    'SELECT * FROM comments WHERE taskId = ? ORDER BY createdAt DESC',
                    [taskId]
                )
                return comments.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt).toISOString(),
                    updatedAt: new Date(comment.updatedAt).toISOString()
                }))
            } catch (error) {
                throw new Error(`Failed to fetch comments for task ${taskId}: ${error.message}`)
            }
        },

        async findById(id) {
            try {
                const comment = await db.get('SELECT * FROM comments WHERE id = ?', [id])
                return comment ? {
                    ...comment,
                    createdAt: new Date(comment.createdAt).toISOString(),
                    updatedAt: new Date(comment.updatedAt).toISOString()
                } : null
            } catch (error) {
                throw new Error(`Failed to fetch comment ${id}: ${error.message}`)
            }
        },

        async create(comment) {
            try {
                    await db.run(`
              INSERT INTO comments (id, taskId, author, content, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
                    comment.id,
                    comment.taskId,
                    comment.author,
                    comment.content,
                    comment.createdAt,
                    comment.updatedAt
                ])

                return comment
            } catch (error) {
                throw new Error(`Failed to create comment: ${error.message}`)
            }
        },

        async update(id, comment) {
            try {
                await db.run(`
              UPDATE comments 
              SET author = ?, content = ?, updatedAt = ?
              WHERE id = ?
            `, [
                    comment.author,
                    comment.content,
                    comment.updatedAt,
                    id
                ])

                return comment
            } catch (error) {
                throw new Error(`Failed to update comment ${id}: ${error.message}`)
            }
        },

        async delete(id) {
            try {
                const comment = await this.findById(id)
                if (!comment) {
                    throw new Error(`Comment with id ${id} not found`)
                }

                await db.run('DELETE FROM comments WHERE id = ?', [id])
                return comment
            } catch (error) {
                throw new Error(`Failed to delete comment ${id}: ${error.message}`)
            }
        }
    }
}
