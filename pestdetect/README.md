# PestDetect (Flutter)

AI-powered mobile app for on-device pest detection and pesticide recommendations.

## Features (initial skeleton)
- Auth (planned): email, phone OTP, Google Sign-In
- Tabs: Home, Upload, History, Recommendations, Profile, Help
- Upload: camera/gallery/video placeholders
- i18n: English + Hindi (extendable)
- TFLite service skeleton for YOLOv8-TFLite

## Getting started
```
flutter pub get
flutter run
```

## Localization
- Edit ARB files in `lib/l10n/`
- Run `flutter gen-l10n`

## Model
- Place `pest_yolo.tflite` under `assets/models/`
- Update preprocessing/postprocessing in `lib/services/tflite_service.dart`

## Roadmap
- Implement auth flows (Firebase or custom backend)
- Camera/gallery/video capture with detection overlay
- Video frame sampling (1 fps) and aggregation
- History sync (local + backend)
- Model update endpoint and download
- Multi-language recommendations
