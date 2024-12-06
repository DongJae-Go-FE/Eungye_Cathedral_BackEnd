import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('은계성당 API')
      .setDescription('은계성당 API입니다.')
      .setVersion('1.0.0')
      .addTag('swagger')
      .build();
  }
}
