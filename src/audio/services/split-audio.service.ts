import { Injectable, StreamableFile } from '@nestjs/common';
import { SplitAudioDto } from '../dtos/split-audio.dto';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { sanitizeFilename } from 'src/shared/utils/sanitize-filename';
import { getAudioDuration } from 'src/shared/utils/get-audio-duration';
import ffmpeg from 'fluent-ffmpeg';
import { basename, join } from 'path';
import { tmpdir } from 'os';
import { ZipArchive } from 'archiver';
import { PassThrough } from 'stream';

@Injectable()
export class SplitAudioService {
  async splitAudio(
    audio: Express.Multer.File,
    { parts }: SplitAudioDto,
  ): Promise<StreamableFile> {
    const clean_filename = sanitizeFilename(audio.originalname);
    const temp_file = join(tmpdir(), `${randomUUID()}_${clean_filename}`);

    await fs.writeFile(temp_file, audio.buffer);

    const duration = await getAudioDuration(temp_file);
    const part_duration = duration / parts;

    const output_folder = await fs.mkdtemp(
      join(tmpdir(), `soundpart-${randomUUID()}`),
    );
    const parent_file_name = clean_filename.split('.')[0];
    const audio_parts: string[] = [];

    for (let i = 0; i < parts; i++) {
      const start = i * part_duration;
      const output = join(
        output_folder,
        `${parent_file_name}-part-${i + 1}.mp3`,
      );
      audio_parts.push(output);

      await new Promise((resolve, reject) => {
        ffmpeg(temp_file)
          .setStartTime(start)
          .setDuration(part_duration)
          .output(join(output))
          .on('end', resolve)
          .on('error', reject)
          .run();
      });
    }

    const archive = new ZipArchive();
    const stream = new PassThrough();
    archive.on('error', console.error);
    archive.on('warning', console.error);

    stream.on('error', console.error);
    stream.on('close', () => {
      console.log('stream closed');
      fs.unlink(temp_file);
      fs.rm(output_folder, { recursive: true, force: true });
    });
    stream.on('end', () => console.log('stream ended'));

    archive.pipe(stream);

    for (const part of audio_parts) {
      archive.file(part, {
        name: basename(part),
      });
    }

    archive.finalize();

    return new StreamableFile(stream, {
      type: 'application/zip',
      disposition: 'attachment; filename="audio-parts.zip"',
    });
  }
}
