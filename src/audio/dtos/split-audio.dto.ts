import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SplitAudioDto {
  @Type(() => Number)
  @IsInt()
  @Min(2)
  parts: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  audio: Express.Multer.File;
}
