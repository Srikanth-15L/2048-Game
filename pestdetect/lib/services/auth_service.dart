import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  AuthService({FlutterSecureStorage? storage}) : _storage = storage ?? const FlutterSecureStorage();
  final FlutterSecureStorage _storage;

  Future<void> signInWithEmail(String email, String password) async {
    // TODO: integrate Firebase Auth or custom backend
    await _storage.write(key: 'token', value: 'dummy');
  }

  Future<void> signInWithPhone(String phone, String otp) async {
    await _storage.write(key: 'token', value: 'dummy');
  }

  Future<void> signInWithGoogle() async {
    await _storage.write(key: 'token', value: 'dummy');
  }

  Future<void> signOut() async {
    await _storage.delete(key: 'token');
  }

  Future<bool> isSignedIn() async {
    final token = await _storage.read(key: 'token');
    return token != null;
  }
}