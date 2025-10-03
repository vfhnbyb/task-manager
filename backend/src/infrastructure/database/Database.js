export const createSQLiteDatabase = async (filename) => {
    try {
        // Правильный импорт sqlite3
        const sqlite3 = (await import('sqlite3')).default
        const { open } = await import('sqlite')

        const db = await open({
            filename,
            driver: sqlite3.Database
        })

        // Включаем поддержку внешних ключей
        await db.run('PRAGMA foreign_keys = ON')

        console.log(`✅ Connected to SQLite database: ${filename}`)

        return {
            async all(sql, params = []) {
                return await db.all(sql, params)
            },
            async get(sql, params = []) {
                return await db.get(sql, params)
            },
            async run(sql, params = []) {
                const result = await db.run(sql, params)
                return { changes: result.changes || 0 }
            }
        }
    } catch (error) {
        console.error('❌ Failed to connect to database:', error)
        throw error
    }
}
