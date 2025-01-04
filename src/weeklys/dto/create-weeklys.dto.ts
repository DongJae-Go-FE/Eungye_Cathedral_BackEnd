import { IsUrl, IsOptional } from 'class-validator';
import { IsNonEmptyString } from 'src/validate-decorators';

export class CreateWeeklysDto {
  @IsNonEmptyString()
  title: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
