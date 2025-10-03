import axios from 'axios'
import type { ITask, IDocument, TaskCreateData, TaskUpdateData } from '@/types/task'

const API_BASE_URL = 'http://localhost:3001/api'

const client = axios.create({
    baseURL: API_BASE_URL
})

// Task API
export const taskApi = {
    getAll: async (): Promise<ITask[]> => {
        const response = await client.get('/tasks')
        return response.data.data.map((item: any) => item.attributes)
    },

    getById: async (id: string): Promise<ITask> => {
        const response = await client.get(`/tasks/${id}`)
        if (!response.data.data) throw new Error('Task not found')
        return response.data.data.attributes
    },

    create: async (taskData: TaskCreateData): Promise<ITask> => {
        const response = await client.post('/tasks', {
            data: { type: 'tasks', attributes: taskData }
        })
        if (!response.data.data) throw new Error('Failed to create task')
        return response.data.data.attributes
    },

    update: async (id: string, taskData: TaskUpdateData): Promise<ITask> => {
        const response = await client.put(`/tasks/${id}`, {
            data: { type: 'tasks', id, attributes: taskData }
        })
        if (!response.data.data) throw new Error('Failed to update task')
        return response.data.data.attributes
    },

    delete: async (id: string): Promise<void> => {
        await client.delete(`/tasks/${id}`)
    }
}

// Document API
export const documentApi = {
    getByTaskId: async (taskId: string): Promise<IDocument[]> => {
        const response = await client.get(`/tasks/${taskId}/documents`)
        return response.data.data.map((item: any) => item.attributes)
    },

    upload: async (taskId: string, file: File): Promise<IDocument> => {
        const formData = new FormData()
        formData.append('document', file)

        const response = await axios.post(
            `${API_BASE_URL}/tasks/${taskId}/documents`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return response.data.data.attributes
    },

    delete: async (id: string): Promise<void> => {
        await client.delete(`/documents/${id}`)
    }
}

// Comment API
export const commentApi = {
    getByTaskId: async (taskId: string): Promise<IComment[]> => {
        const response = await client.get(`/tasks/${taskId}/comments`)
        return response.data.data.map((item: any) => item.attributes)
    },

    create: async (taskId: string, commentData: CommentCreateData): Promise<IComment> => {
        const response = await client.post(`/tasks/${taskId}/comments`, {
            data: { type: 'comments', attributes: commentData }
        })
        return response.data.data.attributes
    },

    update: async (id: string, commentData: CommentUpdateData): Promise<IComment> => {
        const response = await client.put(`/comments/${id}`, {
            data: { type: 'comments', id, attributes: commentData }
        })
        return response.data.data.attributes
    },

    delete: async (id: string): Promise<void> => {
        await client.delete(`/comments/${id}`)
    }
}
