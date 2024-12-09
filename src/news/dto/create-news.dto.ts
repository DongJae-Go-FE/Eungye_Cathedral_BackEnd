import { IsNonEmptyString } from 'src/validate-decorators';

export class CreateNewsDto {
  @IsNonEmptyString()
  title: string;

  @IsNonEmptyString()
  content: string;
}
