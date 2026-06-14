import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SplitAudioService } from '../services/split-audio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SplitAudioDto } from '../dtos/split-audio-dto';

@Controller()
export class SplitAudioController {
  constructor(private readonly splitAudioService: SplitAudioService) {}

  @Post('/split')
  @UseInterceptors(FileInterceptor('audio'))
  async splitAudio(
    @Body() body: SplitAudioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^audio\//,
          }),
        ],
      }),
    )
    audio: Express.Multer.File,
  ): Promise<StreamableFile> {
    return await this.splitAudioService.splitAudio(audio, body);
  }
}
