import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { IsNonEmptyString } from 'src/validate-decorators';

export class CreateWeeklysDto {
  @IsNonEmptyString()
  title: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  id: number;
}
