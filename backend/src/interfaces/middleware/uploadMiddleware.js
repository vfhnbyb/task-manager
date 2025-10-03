import { validateTaskIdParam } from './validation.js'
import { upload } from '../../infrastructure/file-upload/multerConfig.js'

/**
 * Составной middleware для загрузки документов
 */
export const documentUpload = [
    validateTaskIdParam,
    upload.single('document'),
    (error, req, res, next) => {
        if (error) {
            return res.status(400).json({
                errors: [{
                    title: 'File upload failed',
                    detail: error.message
                }]
            })
        }
        next()
    }
]
