export const CommentController = (commentService) => {
    return {
        // GET /tasks/:taskId/comments - получить комментарии задачи
        async getTaskComments(req, res) {
            try {
                const comments = await commentService.getTaskComments(req.params.taskId)

                res.json({
                    data: comments.map(comment => ({
                        type: 'comments',
                        id: comment.id,
                        attributes: comment
                    }))
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to fetch comments', detail: error.message }]
                    })
                }
            }
        },

        // POST /tasks/:taskId/comments - создать комментарий
        async createComment(req, res) {
            try {
                const { data: { attributes } } = req.body

                if (!attributes || !attributes.author || !attributes.content) {
                    return res.status(400).json({
                        errors: [{ title: 'Validation failed', detail: 'Author and content are required' }]
                    })
                }

                const comment = await commentService.createComment(req.params.taskId, attributes)

                res.status(201).json({
                    data: {
                        type: 'comments',
                        id: comment.id,
                        attributes: comment
                    }
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(400).json({
                        errors: [{ title: 'Failed to create comment', detail: error.message }]
                    })
                }
            }
        },

        // PUT /comments/:id - обновить комментарий
        async updateComment(req, res) {
            try {
                const { data: { attributes } } = req.body

                const comment = await commentService.updateComment(req.params.id, attributes)

                res.json({
                    data: {
                        type: 'comments',
                        id: comment.id,
                        attributes: comment
                    }
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Comment not found', detail: error.message }]
                    })
                } else {
                    res.status(400).json({
                        errors: [{ title: 'Failed to update comment', detail: error.message }]
                    })
                }
            }
        },

        // DELETE /comments/:id - удалить комментарий
        async deleteComment(req, res) {
            try {
                await commentService.deleteComment(req.params.id)
                res.status(204).send()
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Comment not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to delete comment', detail: error.message }]
                    })
                }
            }
        }
    }
}
