export interface ITask {
    id: string
    title: string
    description: string
    responsible: string
    status: TaskStatus
    dueDate: string
    createdAt: string
    updatedAt: string
    documents: IDocument[]
    comments: IComment[]
}

export interface IDocument {
    id: string
    taskId: string
    name: string
    filePath: string
    uploadDate: string
    url?: string
}

export interface IComment {
    id: string
    taskId: string
    author: string
    content: string
    createdAt: string
    updatedAt: string
}

export interface TaskCreateData {
    title: string
    description?: string
    dueDate: string
    responsible: string
    status?: TaskStatus
}

export interface TaskUpdateData {
    title?: string
    description?: string
    dueDate?: string
    responsible?: string
    status?: TaskStatus
}

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed'
}

export interface ApiResponse<T = any> {
    data?: T
    errors?: ApiError[]
}

export interface ApiError {
    title: string
    detail: string
    status?: string
}

// Props для компонентов
export interface TaskFormProps {
    mode: 'create' | 'edit' | 'view'
    taskId?: string
}

export interface ModalProps {
    isOpen: boolean
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
}
