// Хелпер для преобразования связанных данных
const transformTaskWithRelations = (task, documents = [], comments = []) => {
    return {
        ...task,
        dueDate: new Date(task.dueDate).toISOString(),
        createdAt: new Date(task.createdAt).toISOString(),
        updatedAt: new Date(task.updatedAt).toISOString(),
        documents: documents.map(doc => ({
            ...doc,
            uploadDate: new Date(doc.uploadDate).toISOString(),
            url: `${doc.filePath}`
        })),
        comments: comments.map(comment => ({
            ...comment,
            createdAt: new Date(comment.createdAt).toISOString(),
            updatedAt: new Date(comment.updatedAt).toISOString()
        }))
    }
}

export const TaskRepository = (db) => {
    return {
        async findAll() {
            try {
                const tasks = await db.all(`
                  SELECT * FROM tasks 
                  ORDER BY createdAt DESC
                `)

                if (tasks.length === 0) return []

                const taskIds = tasks.map(task => task.id)
                const placeholders = taskIds.map(() => '?').join(',')

                const allDocuments = await db.all(`
                  SELECT * FROM documents 
                  WHERE taskId IN (${placeholders}) 
                  ORDER BY uploadDate DESC
                `, taskIds)

                const allComments = await db.all(`
                  SELECT * FROM comments 
                  WHERE taskId IN (${placeholders}) 
                  ORDER BY createdAt DESC
                `, taskIds)

                const documentsByTaskId = allDocuments.reduce((acc, doc) => {
                    if (!acc[doc.taskId]) acc[doc.taskId] = []
                    acc[doc.taskId].push(doc)
                    return acc
                }, {})

                const commentsByTaskId = allComments.reduce((acc, comment) => {
                    if (!acc[comment.taskId]) acc[comment.taskId] = []
                    acc[comment.taskId].push(comment)
                    return acc
                }, {})

                return tasks.map(task =>
                    transformTaskWithRelations(
                        task,
                        documentsByTaskId[task.id] || [],
                        commentsByTaskId[task.id] || []
                    )
                )

            } catch (error) {
                throw new Error(`Failed to fetch tasks: ${error.message}`)
            }
        },

        async findById(id) {
            try {
                const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id])
                if (!task) return null

                const documents = await db.all(
                    'SELECT * FROM documents WHERE taskId = ? ORDER BY uploadDate DESC',
                    [id]
                )

                const comments = await db.all(
                    'SELECT * FROM comments WHERE taskId = ? ORDER BY createdAt DESC',
                    [id]
                )

                return transformTaskWithRelations(task, documents, comments)
            } catch (error) {
                throw new Error(`Failed to fetch task ${id}: ${error.message}`)
            }
        },

        // ... остальные методы без изменений
        async create(task) {
            try {
                await db.run(`
              INSERT INTO tasks (id, title, description, responsible, status, dueDate, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                    task.id,
                    task.title,
                    task.description,
                    task.responsible,
                    task.status,
                    task.dueDate,
                    task.createdAt,
                    task.updatedAt
                ])

                return task
            } catch (error) {
                throw new Error(`Failed to create task: ${error.message}`)
            }
        },

        async update(id, task) {
            try {
                await db.run(`
              UPDATE tasks 
              SET title = ?, description = ?, responsible = ?, status = ?, dueDate = ?, updatedAt = ?
              WHERE id = ?
            `, [
                    task.title,
                    task.description,
                    task.responsible,
                    task.status,
                    task.dueDate,
                    task.updatedAt,
                    id
                ])

                return task
            } catch (error) {
                throw new Error(`Failed to update task ${id}: ${error.message}`)
            }
        },

        async delete(id) {
            try {
                await db.run('DELETE FROM tasks WHERE id = ?', [id])
            } catch (error) {
                throw new Error(`Failed to delete task ${id}: ${error.message}`)
            }
        }
    }
}
