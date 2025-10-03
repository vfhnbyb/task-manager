import fs from 'fs'
import path from 'path'
import { validateUploadedFile } from '../domain/validators.js'

export const DocumentService = (documentRepository, uploadsDirPath) => {
    return {
        async getTaskDocuments(taskId) {
            return await documentRepository.findByTaskId(taskId)
        },

        async uploadDocument(taskId, file) {
            // Валидация файла
            validateUploadedFile(file)
            // Получаем размер файла
            const fileSize = file.size

            const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')

            const document = {
                id: crypto.randomUUID(),
                taskId: taskId,
                name: originalName,
                size: fileSize,
                filePath: `/uploads/${file.filename}`,
                uploadDate: new Date().toISOString()
            }

            const savedDocument = await documentRepository.create(document)

            return {
                ...savedDocument,
                url: `http://localhost:3001${savedDocument.filePath}`
            }
        },

        async deleteDocument(documentId) {
            const document = await documentRepository.delete(documentId)

            // Удаляем физический файл
            const filePath = path.join(uploadsDirPath, path.basename(document.filePath))
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }

            return document
        },

        async getDocumentPath(documentId) {
            const document = await documentRepository.findById(documentId)
            if (!document) {
                throw new Error(`Document with id ${documentId} not found`)
            }

            return path.join(uploadsDirPath, path.basename(document.filePath))
        }
    }
}
