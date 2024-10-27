import { NestFactory } from '@nestjs/core';
import { AppModule, AppDataSource } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Run Migrations - This will be handled in AppModule now
   //const dataSource = app.get(DataSource);
   await AppDataSource.initialize();
   await AppDataSource.runMigrations();
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Blockchain Price Tracker API')
    .setDescription('API Documentation for tracking blockchain prices')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Automatically strip properties that are not defined in the DTO
  }));
  
  // Initialize the AppModule to run migrations
  // await AppModule.initialize();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
