import { IsNonEmptyString } from 'src/validate-decorators';

export class CreateWeeklysDto {
  @IsNonEmptyString()
  title: string;
}
