import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import type {
    ITask,
    IDocument,
    IComment,
    TaskCreateData,
    TaskUpdateData,
    CommentCreateData,
    CommentUpdateData,
    ApiResponse
} from '@/types/task'

// Базовый URL API сервера
const API_BASE_URL = 'http://localhost:3001/api'

/**
 * Создает и настраивает экземпляр axios клиента
 * @returns {AxiosInstance} Настроенный клиент для HTTP запросов
 */
const createClient = (): AxiosInstance => {
    // Создаем экземпляр axios с базовыми настройками
    const client = axios.create({
        baseURL: API_BASE_URL // Все запросы будут начинаться с этого URL
    })

    // Настраиваем интерцепторы для обработки ответов
    client.interceptors.response.use(
        // Успешный ответ - извлекаем только data из response
        (response: AxiosResponse) => response.data,
        // Ошибка - преобразуем в единый формат
        (error) => {
            // Пытаемся получить сообщение об ошибке из ответа сервера,
            // если нет - используем стандартное сообщение axios
            const message = error.response?.data?.errors?.[0]?.detail || error.message
            throw new Error(message)
        }
    )

    return client
}

/**
 * Higher-Order Function для работы с клиентом
 * Создает клиент и передает его в переданную функцию
 * @param fn Функция, которая получит клиент и вернет результат
 * @returns Результат выполнения функции fn
 */
const withClient = <T>(fn: (client: AxiosInstance) => T) => fn(createClient())

/**
 * Создает объект с HTTP методами для переданного клиента
 * @param client Axios клиент
 * @returns Объект с методами get, post, put, delete
 */
const apiMethods = (client: AxiosInstance) => ({
    get: <T>(url: string) => client.get<T>(url),
    post: <T>(url: string, data?: any) => client.post<T>(url, data),
    put: <T>(url: string, data?: any) => client.put<T>(url, data),
    delete: <T>(url: string) => client.delete<T>(url)
})

// ============================================================================
// TASK API - Работа с задачами
// ============================================================================

export const taskApi = {
    /**
     * Получить все задачи
     * @returns {Promise<ITask[]>} Массив задач
     */
    getAll: () => withClient(async (client) => {
        // Получаем метод get из apiMethods
        const { get } = apiMethods(client)

        // Выполняем GET запрос к /tasks
        // Типизируем ответ как ApiResponse с массивом объектов, содержащих attributes типа ITask
        const response = await get<ApiResponse<Array<{ attributes: ITask }>>>('/tasks')

        // Преобразуем ответ: извлекаем attributes из каждого элемента data
        // Если data отсутствует, возвращаем пустой массив
        return response.data?.map(item => item.attributes) || []
    }),

    /**
     * Получить задачу по ID
     * @param id ID задачи
     * @returns {Promise<ITask>} Объект задачи
     */
    getById: (id: string) => withClient(async (client) => {
        const { get } = apiMethods(client)

        // GET запрос к /tasks/{id}
        const response = await get<ApiResponse<{ attributes: ITask }>>(`/tasks/${id}`)

        // Проверяем, что данные получены
        if (!response.data) throw new Error('Task not found')

        return response.data.attributes
    }),

    /**
     * Создать новую задачу
     * @param taskData Данные для создания задачи
     * @returns {Promise<ITask>} Созданная задача
     */
    create: (taskData: TaskCreateData) => withClient(async (client) => {
        const { post } = apiMethods(client)

        // POST запрос к /tasks с данными в формате JSON:API
        const response = await post<ApiResponse<{ attributes: ITask }>>('/tasks', {
            data: {
                type: 'tasks',           // Тип ресурса
                attributes: taskData     // Атрибуты задачи
            }
        })

        if (!response.data) throw new Error('Failed to create task')
        return response.data.attributes
    }),

    /**
     * Обновить задачу
     * @param id ID задачи
     * @param taskData Данные для обновления
     * @returns {Promise<ITask>} Обновленная задача
     */
    update: (id: string, taskData: TaskUpdateData) => withClient(async (client) => {
        const { put } = apiMethods(client)

        // PUT запрос к /tasks/{id} с данными в формате JSON:API
        const response = await put<ApiResponse<{ attributes: ITask }>>(`/tasks/${id}`, {
            data: {
                type: 'tasks',           // Тип ресурса
                id: id,                  // ID ресурса
                attributes: taskData     // Обновляемые атрибуты
            }
        })

        if (!response.data) throw new Error('Failed to update task')
        return response.data.attributes
    }),

    /**
     * Удалить задачу
     * @param id ID задачи для удаления
     * @returns {Promise<void>}
     */
    delete: (id: string) => withClient(async (client) => {
        const { delete: del } = apiMethods(client)

        // DELETE запрос к /tasks/{id}
        await del(`/tasks/${id}`)
    })
}

// ============================================================================
// DOCUMENT API - Работа с документами
// ============================================================================

export const documentApi = {
    /**
     * Получить все документы задачи
     * @param taskId ID задачи
     * @returns {Promise<IDocument[]>} Массив документов
     */
    getByTaskId: (taskId: string) => withClient(async (client) => {
        const { get } = apiMethods(client)

        // GET запрос к /tasks/{taskId}/documents
        const response = await get<ApiResponse<Array<{ attributes: IDocument }>>>(`/tasks/${taskId}/documents`)

        return response.data?.map(item => item.attributes) || []
    }),

    /**
     * Загрузить документ для задачи
     * @param taskId ID задачи
     * @param file Файл для загрузки
     * @returns {Promise<IDocument>} Загруженный документ
     */
    upload: async (taskId: string, file: File): Promise<IDocument> => {
        // Создаем FormData для загрузки файла
        const formData = new FormData()
        formData.append('document', file)

        // Для загрузки файлов используем прямой вызов axios с multipart/form-data
        // Это нужно потому что FormData требует особых заголовков
        const response = await axios.post(
            `${API_BASE_URL}/tasks/${taskId}/documents`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Важно для загрузки файлов
                }
            }
        )

        // Возвращаем attributes из response.data.data (прямой ответ axios)
        return response.data.data.attributes
    },

    /**
     * Удалить документ
     * @param id ID документа
     * @returns {Promise<void>}
     */
    delete: (id: string) => withClient(async (client) => {
        const { delete: del } = apiMethods(client)
        await del(`/documents/${id}`)
    })
}

// ============================================================================
// COMMENT API - Работа с комментариями
// ============================================================================

export const commentApi = {
    /**
     * Получить все комментарии задачи
     * @param taskId ID задачи
     * @returns {Promise<IComment[]>} Массив комментариев
     */
    getByTaskId: (taskId: string) => withClient(async (client) => {
        const { get } = apiMethods(client)

        // GET запрос к /tasks/{taskId}/comments
        const response = await get<ApiResponse<Array<{ attributes: IComment }>>>(`/tasks/${taskId}/comments`)

        return response.data?.map(item => item.attributes) || []
    }),

    /**
     * Создать комментарий для задачи
     * @param taskId ID задачи
     * @param commentData Данные комментария
     * @returns {Promise<IComment>} Созданный комментарий
     */
    create: (taskId: string, commentData: CommentCreateData) => withClient(async (client) => {
        const { post } = apiMethods(client)

        // POST запрос к /tasks/{taskId}/comments
        const response = await post<ApiResponse<{ attributes: IComment }>>(`/tasks/${taskId}/comments`, {
            data: {
                type: 'comments',        // Тип ресурса
                attributes: commentData  // Атрибуты комментария
            }
        })

        if (!response.data) throw new Error('Failed to create comment')
        return response.data.attributes
    }),

    /**
     * Обновить комментарий
     * @param id ID комментария
     * @param commentData Данные для обновления
     * @returns {Promise<IComment>} Обновленный комментарий
     */
    update: (id: string, commentData: CommentUpdateData) => withClient(async (client) => {
        const { put } = apiMethods(client)

        // PUT запрос к /comments/{id}
        const response = await put<ApiResponse<{ attributes: IComment }>>(`/comments/${id}`, {
            data: {
                type: 'comments',        // Тип ресурса
                id: id,                  // ID ресурса
                attributes: commentData  // Обновляемые атрибуты
            }
        })

        if (!response.data) throw new Error('Failed to update comment')
        return response.data.attributes
    }),

    /**
     * Удалить комментарий
     * @param id ID комментария
     * @returns {Promise<void>}
     */
    delete: (id: string) => withClient(async (client) => {
        const { delete: del } = apiMethods(client)
        await del(`/comments/${id}`)
    })
}
