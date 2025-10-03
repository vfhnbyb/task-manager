export const DocumentController = (documentService) => {
    return {
        // GET /tasks/:taskId/documents - получить документы задачи
        async getTaskDocuments(req, res) {
            try {
                const documents = await documentService.getTaskDocuments(req.params.taskId)

                res.json({
                    data: documents.map(doc => ({
                        type: 'documents',
                        id: doc.id,
                        attributes: doc
                    }))
                })
            } catch (error) {
                res.status(500).json({
                    errors: [{ title: 'Failed to fetch documents', detail: error.message }]
                })
            }
        },

        // POST /tasks/:taskId/documents - загрузить документ
        async uploadDocument(req, res) {
            try {
                // Проверяем, что файл был загружен
                if (!req.file) {
                    return res.status(400).json({
                        errors: [{
                            title: 'No file uploaded',
                            detail: 'Please select a file to upload'
                        }]
                    })
                }

                // Проверяем, что taskId существует в params (после валидации)
                if (!req.params.taskId) {
                    return res.status(400).json({
                        errors: [{
                            title: 'Task ID required',
                            detail: 'Task ID is required for document upload'
                        }]
                    })
                }

                const document = await documentService.uploadDocument(
                    req.params.taskId,
                    req.file
                )

                res.status(201).json({
                    data: {
                        type: 'documents',
                        id: document.id,
                        attributes: document
                    }
                })
            } catch (error) {
                // Удаляем загруженный файл в случае ошибки
                if (req.file) {
                    try {
                        const fs = await import('fs')
                        fs.unlinkSync(req.file.path)
                    } catch (deleteError) {
                        console.error('Failed to delete uploaded file:', deleteError)
                    }
                }

                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Task not found', detail: error.message }]
                    })
                } else {
                    res.status(400).json({
                        errors: [{ title: 'Failed to upload document', detail: error.message }]
                    })
                }
            }
        },

        // DELETE /documents/:id - удалить документ
        async deleteDocument(req, res) {
            try {
                await documentService.deleteDocument(req.params.id)
                res.status(204).send()
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Document not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to delete document', detail: error.message }]
                    })
                }
            }
        },

        // GET /documents/:id/download - скачать документ
        async downloadDocument(req, res) {
            try {
                const filePath = await documentService.getDocumentPath(req.params.id)

                res.download(filePath, (err) => {
                    if (err) {
                        res.status(500).json({
                            errors: [{ title: 'Failed to download file', detail: err.message }]
                        })
                    }
                })
            } catch (error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        errors: [{ title: 'Document not found', detail: error.message }]
                    })
                } else {
                    res.status(500).json({
                        errors: [{ title: 'Failed to download document', detail: error.message }]
                    })
                }
            }
        }
    }
}
