/**
 * @typedef {Object} ITask
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'pending'|'in-progress'|'completed'} status
 * @property {string} dueDate ISO string
 * @property {string} createdAt ISO string
 * @property {string} updatedAt ISO string
 */

/**
 * @typedef {Object} IDocument
 * @property {string} id
 * @property {string} taskId
 * @property {string} name
 * @property {string} filePath
 * @property {number} size Размер файла в байтах
 * @property {string} uploadDate ISO string
 */

/**
 * @typedef {Object} IComment
 * @property {string} id
 * @property {string} taskId
 * @property {string} author
 * @property {string} content
 * @property {string} createdAt ISO string
 * @property {string} updatedAt ISO string
 */

/**
 * @typedef {Object} TaskCreateData
 * @property {string} title
 * @property {string} [description]
 * @property {string} dueDate ISO string
 * @property {'pending'|'in-progress'|'completed'} [status]
 */

export const TaskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed'
}

/**
 * @typedef {Object} CommentCreateData
 * @property {string} author
 * @property {string} content
 */

/**
 * @typedef {Object} CommentUpdateData
 * @property {string} [author]
 * @property {string} [content]
 */
