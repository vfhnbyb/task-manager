import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { createTaskRoutes } from './interfaces/routes/taskRoutes.js'
import { createDocumentRoutes } from './interfaces/routes/documentRoutes.js'
import { createCommentRoutes } from './interfaces/routes/commentRoutes.js'
import { errorHandler } from './interfaces/middleware/errorHandler.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Мидлвары
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Статические файлы (для доступа к загруженным документам)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// JSON API v1.1 content-type
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/vnd.api+json')
    next()
})

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Task Manager API'
    })
})

// Инициализация и подключение роутов
const initializeApp = async () => {
    try {
        const taskRoutes = await createTaskRoutes()
        const documentRoutes = await createDocumentRoutes()
        const commentRoutes = await createCommentRoutes()

        app.use('/api', taskRoutes)
        app.use('/api', documentRoutes)
        app.use('/api', commentRoutes)

        // Обработка 404
        app.use('*', (req, res) => {
            res.status(404).json({
                errors: [{
                    title: 'Not Found',
                    detail: `Route ${req.originalUrl} not found`
                }]
            })
        })

        // Глобальный обработчик ошибок
        app.use(errorHandler)

        // Запуск сервера
        app.listen(PORT, () => {
            console.log('='.repeat(50))
            console.log('🚀 Task Manager API Server Started')
            console.log('='.repeat(50))
            console.log(`📍 Server URL: http://localhost:${PORT}`)
            console.log(`❤️  Health check: http://localhost:${PORT}/health`)
            console.log('')
            console.log('📋 TASKS API:')
            console.log(`   GET    http://localhost:${PORT}/api/tasks`)
            console.log(`   POST   http://localhost:${PORT}/api/tasks`)
            console.log(`   GET    http://localhost:${PORT}/api/tasks/:id`)
            console.log(`   PUT    http://localhost:${PORT}/api/tasks/:id`)
            console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`)
            console.log('')
            console.log('📎 DOCUMENTS API:')
            console.log(`   GET    http://localhost:${PORT}/api/tasks/:id/documents`)
            console.log(`   POST   http://localhost:${PORT}/api/tasks/:id/documents`)
            console.log(`   DELETE http://localhost:${PORT}/api/documents/:id`)
            console.log(`   GET    http://localhost:${PORT}/api/documents/:id/download`)
            console.log('')
            console.log('💬 COMMENTS API:')
            console.log(`   GET    http://localhost:${PORT}/api/tasks/:id/comments`)
            console.log(`   POST   http://localhost:${PORT}/api/tasks/:id/comments`)
            console.log(`   PUT    http://localhost:${PORT}/api/comments/:id`)
            console.log(`   DELETE http://localhost:${PORT}/api/comments/:id`)
            console.log('')
            console.log(`📁 File uploads directory: http://localhost:${PORT}/uploads/`)
            console.log('='.repeat(50))
        })

    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

// Обработка неперехваченных ошибок
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error)
    process.exit(1)
})

initializeApp()
