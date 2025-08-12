import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/history_models.dart';

class HistoryService {
  static const String _boxName = 'history';

  Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox<Map>(_boxName);
  }

  Future<DetectionRecord> addRecord({
    required String userId,
    required String mediaPath,
    required String mediaType,
    required List<Map<String, dynamic>> results,
    required List<Map<String, dynamic>> recommended,
    String? location,
  }) async {
    final box = Hive.box<Map>(_boxName);
    final record = DetectionRecord(
      id: const Uuid().v4(),
      userId: userId,
      mediaPath: mediaPath,
      mediaType: mediaType,
      results: results,
      recommended: recommended,
      timestamp: DateTime.now(),
      location: location,
    );
    await box.put(record.id, {
      'id': record.id,
      'userId': record.userId,
      'mediaPath': record.mediaPath,
      'mediaType': record.mediaType,
      'results': record.results,
      'recommended': record.recommended,
      'timestamp': record.timestamp.toIso8601String(),
      'location': record.location,
    });
    return record;
  }

  List<DetectionRecord> getAll() {
    final box = Hive.box<Map>(_boxName);
    return box.values.map((m) {
      return DetectionRecord(
        id: m['id'] as String,
        userId: m['userId'] as String,
        mediaPath: m['mediaPath'] as String,
        mediaType: m['mediaType'] as String,
        results: (m['results'] as List).cast<Map<String, dynamic>>(),
        recommended: (m['recommended'] as List).cast<Map<String, dynamic>>(),
        timestamp: DateTime.parse(m['timestamp'] as String),
        location: m['location'] as String?,
      );
    }).toList();
  }
}