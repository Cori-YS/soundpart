import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SplitAudioService } from '../services/split-audio.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SplitAudioDto } from '../dtos/split-audio.dto';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('audio')
@Controller()
export class SplitAudioController {
  constructor(private readonly splitAudioService: SplitAudioService) {}

  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Splits audio into N parts and returns a ZIP file' })
  @ApiProduces('application/zip')
  @ApiOkResponse({
    description: 'ZIP with the audio parts',
    content: {
      'application/zip': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @Post('/split')
  @HttpCode(HttpStatus.OK)
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
