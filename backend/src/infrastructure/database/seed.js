import { createSQLiteDatabase } from './Database.js'

const seed = async () => {
    const db = await createSQLiteDatabase('./tasks.db')

    try {
        // Очищаем таблицы
        await db.run('DELETE FROM tasks')
        await db.run('DELETE FROM documents')
        await db.run('DELETE FROM comments')

        // Генерируем ID
        const task1Id = crypto.randomUUID()
        const task2Id = crypto.randomUUID()
        const task3Id = crypto.randomUUID()

        const doc1Id = crypto.randomUUID()
        const doc2Id = crypto.randomUUID()

        const comment1Id = crypto.randomUUID()
        const comment2Id = crypto.randomUUID()
        const comment3Id = crypto.randomUUID()

        // Тестовые задачи
        const tasks = [
            {
                id: task1Id,
                title: 'Разработать главную страницу',
                description: 'Создать адаптивную верстку по макету Figma. Учесть требования по доступности и SEO.',
                responsible: 'Иванов Иван Иванович',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 дней
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // -2 дня
                updatedAt: new Date().toISOString()
            },
            {
                id: task2Id,
                title: 'Написать API для задач',
                description: 'Реализовать CRUD операции с валидацией данных. Добавить пагинацию и фильтрацию.',
                responsible: 'Иванов Иван Иванович',
                status: 'completed',
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // -2 дня
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // -5 дней
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // -1 день
            },
            {
                id: task3Id,
                title: 'Протестировать приложение',
                description: 'Написать unit-тесты для всех компонентов. Провести интеграционное тестирование API.',
                responsible: 'Иванов Иван Иванович',
                status: 'pending',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 дня
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // -1 день
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: crypto.randomUUID(),
                title: 'Добавить аутентификацию пользователей',
                description: 'Реализовать систему регистрации и входа. Добавить JWT токены и защищенные маршруты.',
                responsible: 'Иванов Иван Иванович',
                status: 'pending',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // +14 дней
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: crypto.randomUUID(),
                title: 'Оптимизировать производительность базы данных',
                description: 'Добавить индексы для часто используемых полей. Оптимизировать сложные запросы.',
                responsible: 'Иванов Иван Иванович',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // +5 дней
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // -3 дня
                updatedAt: new Date().toISOString()
            }
        ]

        // Вставляем задачи
        for (const task of tasks) {
            await db.run(`
            INSERT INTO tasks (id, title, description, responsible, status, dueDate, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
                task.id,
                task.title,
                task.description,
                task.responsible,
                task.status,
                task.dueDate,
                task.createdAt,
                task.updatedAt
            ])
        }

        // Тестовые документы
        const documents = [
            {
                id: doc1Id,
                taskId: task1Id,
                name: 'Макет главной страницы.pdf',
                size: '123123',
                filePath: '/uploads/design-specifications.pdf',
                uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // -1 день
            },
            {
                id: doc2Id,
                taskId: task1Id,
                name: 'Требования к адаптивности.docx',
                size: '1231233',
                filePath: '/uploads/responsive-requirements.docx',
                uploadDate: new Date().toISOString()
            }
        ]

        for (const doc of documents) {
            await db.run(`
            INSERT INTO documents (id, taskId, name, size, filePath, uploadDate)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
                doc.id,
                doc.taskId,
                doc.name,
                doc.size,
                doc.filePath,
                doc.uploadDate
            ])
        }

        // Тестовые комментарии
        const comments = [
            {
                id: comment1Id,
                taskId: task1Id,
                author: 'Алексей Петров',
                content: 'Нужно добавить мобильную версию главной страницы. Учесть требования для маленьких экранов.',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // -2 дня
                updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: comment2Id,
                taskId: task1Id,
                author: 'Мария Иванова',
                content: 'Уже работаю над адаптивной версткой. Буду использовать CSS Grid и Flexbox для responsive design.',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // -1 день
                updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: comment3Id,
                taskId: task2Id,
                author: 'Иван Сидоров',
                content: 'API готово, можно начинать тестирование. Все endpoints возвращают данные в формате JSON API.',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // -3 дня
                updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: crypto.randomUUID(),
                taskId: task3Id,
                author: 'Елена Козлова',
                content: 'Для тестирования будем использовать Jest и Supertest. Нужно покрыть все основные сценарии.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: crypto.randomUUID(),
                taskId: task1Id,
                author: 'Дмитрий Смирнов',
                content: 'Добавил новые иконки для главной страницы. Проверьте, пожалуйста, в разных браузерах.',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ]

        for (const comment of comments) {
            await db.run(`
            INSERT INTO comments (id, taskId, author, content, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
                comment.id,
                comment.taskId,
                comment.author,
                comment.content,
                comment.createdAt,
                comment.updatedAt
            ])
        }

        console.log('✅ Database seeded successfully')
        console.log(`📊 Created ${tasks.length} tasks, ${documents.length} documents, ${comments.length} comments`)

    } catch (error) {
        console.error('❌ Seeding failed:', error)
        throw error
    } finally {
        // Закрываем соединение с базой данных
        if (db.close) {
            await db.close()
        }
    }
}

// Функция для генерации случайных дат (для демонстрационных целей)
function generateRandomDate(daysFromNow) {
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + daysFromNow)
    return baseDate.toISOString()
}

// Запуск сида если файл вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    seed().catch(error => {
        console.error('Seed failed:', error)
        process.exit(1)
    })
}

export { seed }
