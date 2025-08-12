import 'dart:io';

class ModelUpdateService {
  Future<String?> checkForUpdate() async {
    // TODO: hit GET /model/latest and compare with local version
    return null; // return download URL if newer available
  }

  Future<File?> downloadAndInstall(String url) async {
    // TODO: download and save to assets directory / app dir
    return null;
  }
}