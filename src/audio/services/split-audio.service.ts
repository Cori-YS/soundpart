import { Injectable } from '@nestjs/common';

@Injectable()
export class SplitAudioService {
  splitAudio(): string {
    return 'Hello SoundPart!';
  }
}
