export const DocumentRepository = (db) => {
    return {
        async findByTaskId(taskId) {
            try {
                const documents = await db.all(
                    'SELECT * FROM documents WHERE taskId = ? ORDER BY uploadDate DESC',
                    [taskId]
                )
                return documents.map(doc => ({
                    ...doc,
                    uploadDate: new Date(doc.uploadDate).toISOString()
                }))
            } catch (error) {
                throw new Error(`Failed to fetch documents for task ${taskId}: ${error.message}`)
            }
        },

        async findById(id) {
            try {
                const document = await db.get('SELECT * FROM documents WHERE id = ?', [id])
                return document ? {
                    ...document,
                    uploadDate: new Date(document.uploadDate).toISOString()
                } : null
            } catch (error) {
                throw new Error(`Failed to fetch document ${id}: ${error.message}`)
            }
        },

        async create(document) {
            try {
                await db.run(`
              INSERT INTO documents (id, taskId, name, size, filePath, uploadDate)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
                    document.id,
                    document.taskId,
                    document.name,
                    document.size,
                    document.filePath,
                    document.uploadDate
                ])

                return document
            } catch (error) {
                throw new Error(`Failed to create document: ${error.message}`)
            }
        },

        async delete(id) {
            try {
                const document = await this.findById(id)
                if (!document) {
                    throw new Error(`Document with id ${id} not found`)
                }

                await db.run('DELETE FROM documents WHERE id = ?', [id])
                return document // Возвращаем удаленный документ для очистки файла
            } catch (error) {
                throw new Error(`Failed to delete document ${id}: ${error.message}`)
            }
        }
    }
}
