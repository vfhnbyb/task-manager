/**
 * Валидация задачи
 * @param {Object} task
 * @throws {Error} Если валидация не пройдена
 */
export function validateTask(task) {
    if (!task.title || task.title.trim().length === 0) {
        throw new Error('Task title is required')
    }

    if (task.title.length > 255) {
        throw new Error('Task title is too long (max 255 characters)')
    }

    if (!task.dueDate) {
        throw new Error('Due date is required')
    }

    const dueDate = new Date(task.dueDate)
    if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date format')
    }

    if (dueDate < new Date()) {
        throw new Error('Due date cannot be in the past')
    }

    const validStatuses = ['pending', 'in-progress', 'completed']
    if (!validStatuses.includes(task.status)) {
        throw new Error(`Invalid task status. Must be one of: ${validStatuses.join(', ')}`)
    }
}

/**
 * Валидация документа
 * @param {Object} document
 * @throws {Error} Если валидация не пройдена
 */
export function validateDocument(document) {
    if (!document.name || document.name.trim().length === 0) {
        throw new Error('Document name is required')
    }

    if (document.name.length > 255) {
        throw new Error('Document name is too long (max 255 characters)')
    }

    if (!document.filePath) {
        throw new Error('File path is required')
    }

    if (!document.taskId) {
        throw new Error('Task ID is required for document')
    }

    const uploadDate = new Date(document.uploadDate)
    if (isNaN(uploadDate.getTime())) {
        throw new Error('Invalid upload date format')
    }
}

/**
 * Валидация комментария
 * @param {Object} comment
 * @throws {Error} Если валидация не пройдена
 */
export function validateComment(comment) {
    if (!comment.author || comment.author.trim().length === 0) {
        throw new Error('Comment author is required')
    }

    if (comment.author.length > 100) {
        throw new Error('Comment author name is too long (max 100 characters)')
    }

    if (!comment.content || comment.content.trim().length === 0) {
        throw new Error('Comment content is required')
    }

    if (comment.content.length > 1000) {
        throw new Error('Comment content is too long (max 1000 characters)')
    }

    if (!comment.taskId) {
        throw new Error('Task ID is required for comment')
    }

    const createdAt = new Date(comment.createdAt)
    if (isNaN(createdAt.getTime())) {
        throw new Error('Invalid creation date format')
    }

    const updatedAt = new Date(comment.updatedAt)
    if (isNaN(updatedAt.getTime())) {
        throw new Error('Invalid update date format')
    }
}

/**
 * Валидация данных для создания задачи
 * @param {Object} taskData
 * @throws {Error} Если валидация не пройдена
 */
export function validateTaskCreateData(taskData) {
    if (!taskData.title || taskData.title.trim().length === 0) {
        throw new Error('Task title is required')
    }

    if (!taskData.dueDate) {
        throw new Error('Due date is required')
    }

    const dueDate = new Date(taskData.dueDate)
    if (isNaN(dueDate.getTime())) {
        throw new Error('Invalid due date format')
    }
}

/**
 * Валидация файла при загрузке
 * @param {Object} file
 * @throws {Error} Если валидация не пройдена
 */
export function validateUploadedFile(file) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ]

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt']

    if (!file) {
        throw new Error('File is required')
    }

    if (file.size > maxSize) {
        throw new Error(`File size too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`)
    }

    // Дополнительная проверка по расширению
    const fileExtension = file.originalname.toLowerCase().slice(
        file.originalname.lastIndexOf('.')
    )

    if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(`File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`)
    }
}

/**
 * Валидация UUID
 * @param {string} id
 * @throws {Error} Если ID невалидный
 */
export function validateUUID(id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
        throw new Error('Invalid ID format')
    }
}
