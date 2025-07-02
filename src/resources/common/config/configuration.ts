export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
    queueName: process.env.JONG_SERVICE_QUEUE_NAME || 'authentication_queue',
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : '*',
  },
});
