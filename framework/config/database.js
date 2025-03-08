module.exports = {
    default: {
        client: 'sqlite3',
        connection: {
            filename: process.cwd() + "/storage/stories/database.sqlite"
        },
        useNullAsDefault: true,
    },
    mysql: {
        client: process.env.DB_CLIENT ?? 'mysql2',
        connection: {
            host: process.env.DB_HOST ?? '127.0.0.1',
            port: process.env.DB_PORT ?? 3306,
            user: process.env.DB_USER ?? 'root',
            password: process.env.DB_PASSWORD ?? '12345678',
            database: process.env.DB_DATABASE ?? 'test',
        },
        useNullAsDefault: true,
    }
}