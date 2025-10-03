import { validateTaskCreateData, validateUUID } from '../../domain/validators.js'

/**
 * Middleware для валидации UUID в параметрах маршрута
 * @param {...string} paramNames - названия параметров для валидации
 */
export const validateParamsUUID = (...paramNames) => {
    return (req, res, next) => {
        try {
            for (const paramName of paramNames) {
                if (req.params[paramName]) {
                    validateUUID(req.params[paramName])
                }
            }
            next()
        } catch (error) {
            res.status(400).json({
                errors: [{ title: 'Invalid ID', detail: error.message }]
            })
        }
    }
}

/**
 * Middleware для валидации данных задачи
 */
export const validateTaskData = (req, res, next) => {
    try {
        const { data: { attributes } } = req.body

        if (!attributes) {
            return res.status(400).json({
                errors: [{ title: 'Validation failed', detail: 'Request data is required' }]
            })
        }

        validateTaskCreateData(attributes)
        next()
    } catch (error) {
        res.status(400).json({
            errors: [{ title: 'Validation failed', detail: error.message }]
        })
    }
}

/**
 * Middleware для валидации комментария
 */
export const validateCommentData = (req, res, next) => {
    try {
        const { data: { attributes } } = req.body

        if (!attributes) {
            return res.status(400).json({
                errors: [{ title: 'Validation failed', detail: 'Request data is required' }]
            })
        }

        if (!attributes.author || !attributes.content) {
            return res.status(400).json({
                errors: [{ title: 'Validation failed', detail: 'Author and content are required' }]
            })
        }

        next()
    } catch (error) {
        res.status(400).json({
            errors: [{ title: 'Validation failed', detail: error.message }]
        })
    }
}

/**
 * Специфичные middleware для часто используемых случаев
 */

// Для маршрутов с :id
export const validateTaskId = (req, res, next) => {
    validateParamsUUID('id')(req, res, next)
}

// Для маршрутов с :taskId
export const validateTaskIdParam = (req, res, next) => {
    validateParamsUUID('taskId')(req, res, next)
}

// Для маршрутов с :documentId
export const validateDocumentId = (req, res, next) => {
    validateParamsUUID('id')(req, res, next)
}

// Для маршрутов с :commentId
export const validateCommentId = (req, res, next) => {
    validateParamsUUID('id')(req, res, next)
}

// Универсальный вариант для любых параметров
export const validateTaskAndCommentIds = (req, res, next) => {
    validateParamsUUID('taskId', 'id')(req, res, next)
}

