class PestDetectionBox {
  final int pestId;
  final String name;
  final double confidence;
  final double x;
  final double y;
  final double width;
  final double height;

  const PestDetectionBox({
    required this.pestId,
    required this.name,
    required this.confidence,
    required this.x,
    required this.y,
    required this.width,
    required this.height,
  });
}

class PesticideRecommendation {
  final int pesticideId;
  final String name;
  final String dosage;
  final String method;
  final String safety;
  final String waitingPeriod;
  final String nonChemical;
  final String language;

  const PesticideRecommendation({
    required this.pesticideId,
    required this.name,
    required this.dosage,
    required this.method,
    required this.safety,
    required this.waitingPeriod,
    required this.nonChemical,
    required this.language,
  });
}