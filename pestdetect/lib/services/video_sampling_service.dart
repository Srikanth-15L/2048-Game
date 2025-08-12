import 'dart:io';

class VideoSamplingService {
  /// Samples 1 frame per second by default. Implementation TBD using FFmpeg or platform codecs.
  Future<List<File>> sampleFrames(File videoFile, {int fps = 1}) async {
    // Placeholder: return empty list. Implement using video_thumbnail or custom extraction.
    return <File>[];
  }
}