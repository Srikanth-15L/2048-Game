class UserProfile {
  final String id;
  final String name;
  final String? phone;
  final String? email;
  final String preferredLanguage;
  final String? farmLocation;
  final DateTime createdAt;

  const UserProfile({
    required this.id,
    required this.name,
    this.phone,
    this.email,
    required this.preferredLanguage,
    this.farmLocation,
    required this.createdAt,
  });
}

class DetectionRecord {
  final String id;
  final String userId;
  final String mediaPath;
  final String mediaType; // image | video
  final List<Map<String, dynamic>> results; // [{pestId,name,confidence,bbox}]
  final List<Map<String, dynamic>> recommended; // [{pesticideId,name,dosage,language}]
  final DateTime timestamp;
  final String? location;

  const DetectionRecord({
    required this.id,
    required this.userId,
    required this.mediaPath,
    required this.mediaType,
    required this.results,
    required this.recommended,
    required this.timestamp,
    this.location,
  });
}