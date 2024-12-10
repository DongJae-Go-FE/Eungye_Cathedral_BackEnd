import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { IsNonEmptyString } from 'src/validate-decorators';

export class CreateNewsDto {
  @IsNonEmptyString()
  title: string;

  @IsNonEmptyString()
  content: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  id: number;
}
