import { DocumentController } from '../controllers/DocumentController.js'
import { DocumentService } from '../../application/DocumentService.js'
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository.js'
import { createSQLiteDatabase } from '../../infrastructure/database/Database.js'
import { uploadsDirPath } from '../../infrastructure/file-upload/multerConfig.js'
import { validateTaskIdParam, validateDocumentId } from '../middleware/validation.js'
import { documentUpload } from '../middleware/uploadMiddleware.js'

export const createDocumentRoutes = async () => {
    const { default: express } = await import('express')
    const router = express.Router()

    try {
        const db = await createSQLiteDatabase('./tasks.db')
        const documentRepository = DocumentRepository(db)
        const documentService = DocumentService(documentRepository, uploadsDirPath)
        const documentController = DocumentController(documentService)

        // Маршруты для документов
        router.get('/tasks/:taskId/documents', validateTaskIdParam, documentController.getTaskDocuments)
        router.post(
            '/tasks/:taskId/documents',
            documentUpload, // Все middleware в одном
            documentController.uploadDocument
        )
        router.delete('/documents/:id', validateDocumentId, documentController.deleteDocument)
        router.get('/documents/:id/download', validateDocumentId, documentController.downloadDocument)

        console.log('✅ Document routes initialized')
        return router
    } catch (error) {
        console.error('❌ Failed to initialize document routes:', error)
        throw error
    }
}
