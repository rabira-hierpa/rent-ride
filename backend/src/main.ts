import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './logger/service/logger.service';

async function bootstrap() {
  const logger = new WinstonLoggerService();
  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: VERSION_NEUTRAL,
    });

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const options = new DocumentBuilder()
      .setTitle('Fullstack Auth App API')
      .setDescription('The Fullstack Auth App API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    });

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            'default-src': [`'self'`],
          },
        },
      }),
    );
    // TODO: Replace with a real origin in production
    app.enableCors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
    });
    await app.listen(process.env.PORT ?? 3000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error starting the application', error);
  }
}
bootstrap();
