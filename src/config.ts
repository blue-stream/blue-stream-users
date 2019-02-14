export const config = {
    rpc: {
        port: +(process.env.RPC_PORT || 6001),
    },
    db: {
        host: process.env.DB_SERVER || 'localhost',
        name: process.env.DB_NAME || 'blue-stream-user',
        port: +(process.env.DB_PORT || 27017),
    },
    logger: {
        durable: false,
        exchangeType: process.env.RMQ_LOGGER_TYPE || 'topic',
        exchange: process.env.RMQ_LOGGER_EXCHANGE || 'blue_stream_logs',
        host: process.env.RMQ_LOGGER_HOST || 'localhost',
        port: +(process.env.RMQ_LOGGER_PORT || 15672),
        password: process.env.RMQ_LOGGER_PASS || 'guest',
        username: process.env.RMQ_LOGGER_USER || 'guest',
        persistent: false,
    },
    rabbitMQ: {
        host: process.env.RMQ_HOST || 'localhost',
        port: +(process.env.RMQ_PORT || 5672),
        password: process.env.RMQ_PASSWORD || 'guest',
        username: process.env.RMQ_USERNAME || 'guest',
    },
    validator: {
        user: {
            id: /^[\w-]+@[\w-]+$/,
            firstname: {
                minLength: +(process.env.USER_FIRSTNAME_MIN_LEN || 2),
                maxLength: +(process.env.USER_FIRSTNAME_MAX_LEN || 15),
            },
            lastname: {
                minLength: +(process.env.USER_LASTNAME_MIN_LEN || 2),
                maxLength: +(process.env.USER_LASTNAME_MAX_LEN || 15),
            },
            email: /^[\w-]+\@[\w-]+\.[\w-]+$/i,
        },
    },
    server: {
        port: +(process.env.PORT || 3000),
        name: 'user',
    },
    pagination: {
        startIndex: 0,
        endIndex: 20,
    },
    sort: {
        sortOrder: '-',
        sortBy: 'createdAt',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
    classifications: {
        serviceApi: process.env.CLASSIFICATIONS_API || 'http://localhost:5006/classificationservice/api',
        token: process.env.CLASSIFICATIONS_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.B3bRU1r3QAooc974CfHtGwQUYIUjEV4wywoO0bvOO0E',
        expirationDays: +(process.env.CLASSIFICATIONS_EXPIRATION_DAYS || 3), // Days
    },
};
