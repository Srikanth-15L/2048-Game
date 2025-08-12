import 'dart:typed_data';
import 'package:tflite_flutter/tflite_flutter.dart' as tfl;

class DetectionResult {
  final String pestName;
  final double confidence;
  final List<double> bbox; // [x, y, w, h]
  DetectionResult({required this.pestName, required this.confidence, required this.bbox});
}

class TFLiteService {
  tfl.Interpreter? _interpreter;

  Future<void> loadModel({String assetPath = 'assets/models/pest_yolo.tflite'}) async {
    _interpreter?.close();
    _interpreter = await tfl.Interpreter.fromAsset(assetPath);
  }

  bool get isLoaded => _interpreter != null;

  Future<List<DetectionResult>> runOnImageBytes(Uint8List bytes, {int imageWidth = 640, int imageHeight = 640}) async {
    if (_interpreter == null) {
      throw StateError('Interpreter not loaded');
    }

    // NOTE: This is a skeleton. You will need to implement
    // preprocessing to the model's input tensor shape and postprocessing
    // according to your YOLO export. Placeholder returns empty list.
    return <DetectionResult>[];
  }

  void dispose() {
    _interpreter?.close();
    _interpreter = null;
  }
}