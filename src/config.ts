export const config = {
    rpc: {
        port: +(process.env.RPC_PORT || 6001),
    },
    db: {
        connectionString: `mongodb://${process.env.DB_SERVERS || 'localhost:27017'}/${process.env.USERS_DB_NAME || 'blue-stream-user'}${process.env.DB_REPLICA_NAME ? `?replicaSet=${process.env.DB_REPLICA_NAME}` : ''}`,
    },
    logger: {
        elasticsearch: process.env.LOGGER_ELASTICSEARCH && {
            hosts: process.env.LOGGER_ELASTICSEARCH.split(','),
        },
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
