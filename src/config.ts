export const config = {
    rpc: {
        port: +(process.env.RPC_PORT || 6001),
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/blue-stream-user',
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
    channels: {
        endpoint: process.env.CHANNELS_RPC_ENDPOINT || 'http://localhost',
        port: +(process.env.CHANNELS_RPC_PORT || 6000),
        methods: {
            CREATE_USER_PROFILE: 'createUserChannel',
        },
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
    },
};
