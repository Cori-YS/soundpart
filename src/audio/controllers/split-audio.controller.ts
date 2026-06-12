import { Controller, Get } from '@nestjs/common';
import { SplitAudioService } from '../services/split-audio.service';

@Controller()
export class SplitAudioController {
  constructor(private readonly splitAudioService: SplitAudioService) {}

  @Get('/split')
  splitAudio(): string {
    return this.splitAudioService.splitAudio();
  }
}
