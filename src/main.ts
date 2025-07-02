import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Booststrap');

  console.log('Timestamp:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Port:', process.env.PORT);
  console.log('Timezone:', process.env.TZ);
  console.log('Working Directory:', process.cwd());

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      bufferLogs: false,
    });

    const configService = app.get(ConfigService);

    console.log('NestJS application created successfully.');

    // app.useGlobalFilters(new )
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    console.log('Global filters and pipes configured successfully.');

    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'api/v',
      defaultVersion: '1',
    });

    console.log('API versioning configured successfully.');

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    console.log('CORS enabled successfully.');

    if (configService.get('SWAGGER_ENABLED') === 'true') {
      console.log('Swagger enabled successfully.');

      const config = new DocumentBuilder()
        .setTitle('Authentication JWT API')
        .setDescription('Authentication API By Va1ent0n')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
          },
          'jwt-auth',
        )
        .addApiKey(
          {
            type: 'apiKey',
            name: 'X-API-KEY',
            in: 'header',
            description: 'Enter API key',
          },
          'api-key',
        )
        .addGlobalParameters({
          name: 'lang',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['en', 'la', 'zh'],
            default: 'en',
          },
          description: 'Languages',
        })
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      console.log('Swagger documentation configured successfully.');
    }

    const port = configService.get('PORT') || 3001;
    await app.listen(port);

    const startUpMessage = `🚀 Application successfully started on port ${port}`;
    const apiUrl = `📚 API documentation: http://localhost:${port}/api`;
    const healthCheckUrl = `👀 Health check: http://localhost:${port}/api/v1/health`;

    logger.log(startUpMessage);
    logger.log(apiUrl);
    logger.log(healthCheckUrl);

    console.log(startUpMessage);
    console.log(apiUrl);
    console.log(healthCheckUrl);

    setInterval(() => {
      console.log(
        `[${new Date().toISOString()}] Application health check - Running normally!!`,
      );
    }, 30000);
  } catch (error) {
    const errorMessage = `Failed error while during application startup: ${error.message}`;
    logger.error(errorMessage, error.stack);
    console.error(errorMessage, error);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}
bootstrap();
