import { createSQLiteDatabase } from './Database.js'

const migrate = async () => {
    try {
        const db = await createSQLiteDatabase('./tasks.db')

        // Таблица задач
        await db.run(`
          CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            responsible TEXT DEFAULT '',
            status TEXT DEFAULT 'pending',
            dueDate TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          )
    `)

        // Таблица документов
        await db.run(`
            CREATE TABLE IF NOT EXISTS documents (
                 id TEXT PRIMARY KEY,
                 taskId TEXT NOT NULL,
                 name TEXT NOT NULL,
                 size TEXT NOT NULL,
                 filePath TEXT NOT NULL,
                 uploadDate TEXT NOT NULL,
                 FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
                )
        `)

        // Таблица комментариев
        await db.run(`
            CREATE TABLE IF NOT EXISTS comments (
                id TEXT PRIMARY KEY,
                taskId TEXT NOT NULL,
                author TEXT NOT NULL,
                content TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                updatedAt TEXT NOT NULL,
                FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE
                )
        `)

        console.log('✅ Database migrated successfully')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    }
}

migrate()
