import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SplitAudioDto {
  @Type(() => Number)
  @IsInt()
  parts: number;
}
