import { Module } from '@nestjs/common';
import { SplitAudioController } from './controllers/split-audio.controller';
import { SplitAudioService } from './services/split-audio.service';

@Module({
  imports: [],
  controllers: [SplitAudioController],
  providers: [SplitAudioService],
})
export class AudioModule {}
