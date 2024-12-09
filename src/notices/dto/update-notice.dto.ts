import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticesDto } from './create-notices.dto';

export class UpdateNoticesDto extends PartialType(CreateNoticesDto) {}
