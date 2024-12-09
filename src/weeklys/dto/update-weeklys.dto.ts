import { PartialType } from '@nestjs/mapped-types';
import { CreateWeeklysDto } from './create-weeklys.dto';

export class UpdateWeeklysDto extends PartialType(CreateWeeklysDto) {}
