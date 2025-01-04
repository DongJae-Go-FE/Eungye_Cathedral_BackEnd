import { IsUrl, IsOptional } from 'class-validator';
import { IsNonEmptyString } from 'src/validate-decorators';
export class CreateNoticesDto {
  @IsNonEmptyString()
  title: string;

  @IsNonEmptyString()
  content: string;

  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
