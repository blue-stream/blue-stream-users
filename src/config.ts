export const config = {
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
            id: /^[\w-]+$/,
            firstname: {
                minLength: 2,
                maxLength: 20,
            },
            lastname: {
                minLength: 2,
                maxLength: 20,
            },
            email: /^[\w.-]+\@[\w.-]+$/i,
        },
    },
    server: {
        port: +(process.env.PORT || 3000),
        name: 'user',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
};
