import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tflite_service.dart';

final tfliteServiceProvider = Provider<TFLiteService>((ref) {
  final service = TFLiteService();
  ref.onDispose(service.dispose);
  return service;
});

final preferredLanguageProvider = StateProvider<String>((ref) => 'en');