import { CreateModuleDto } from "./createModule.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}