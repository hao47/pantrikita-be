import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as compression from 'compression';
import { ApiConsumes, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './exception-filter';
import { GlobalFileInterceptor } from './interceptors/global.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';


function setupConfig(app: INestApplication) {
  app.enableCors();
  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
  );
  app.use(compression());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new GlobalFileInterceptor());
}


function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
      .setTitle('Pantrikita Swagger')
      .setDescription('The Pantrikita API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure body parser for multipart form data
  app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Content-Type:', req.headers['content-type']);
    next();
  });



  setupConfig(app);
  setupSwagger(app);

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  await app.listen(5000);
}
bootstrap();
