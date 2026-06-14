import ffmpeg from 'fluent-ffmpeg';

export function getAudioDuration(file_path: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file_path, (err: Error, metadata) => {
      if (err) return reject(err);

      resolve(metadata.format.duration || 0);
    });
  });
}
