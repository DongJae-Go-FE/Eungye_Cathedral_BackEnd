import { ValidationPipe } from '@nestjs/common';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { BaseAPIDocument } from './swagger.document';
import { ClassValidatorException } from './util/class-validator-exeption';
import { PrismaClientExceptionFilter } from './util/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new ClassValidatorException(errors),
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: false,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.CLASSIC),
  };
  SwaggerModule.setup('api', app, document, options);

  await app.listen(9093);
}
bootstrap();
