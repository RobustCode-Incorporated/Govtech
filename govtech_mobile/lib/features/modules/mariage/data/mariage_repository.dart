import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:govtech_mobile/features/auth/data/auth_repository.dart';

class MariageRepository {
  final String baseUrl;

  MariageRepository({required this.baseUrl});

  Future<void> submitMariageRequest({
    required String epouxNom,
    required String epouxPostnom,
    required String epouxPrenom,
    required String epouseNom,
    required String epousePostnom,
    required String epousePrenom,
    required String dateMariage,
    required String lieuMariage,
  }) async {
    final authRepo = AuthRepository(baseUrl: baseUrl);
    final token = await authRepo.getToken();

    final response = await http.post(
      Uri.parse('$baseUrl/citizen/mariages'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'epoux_nom': epouxNom,
        'epoux_postnom': epouxPostnom,
        'epoux_prenom': epouxPrenom,
        'epouse_nom': epouseNom,
        'epouse_postnom': epousePostnom,
        'epouse_prenom': epousePrenom,
        'date_mariage': dateMariage,
        'lieu_mariage': lieuMariage,
      }),
    );

    if (response.statusCode != 201) {
      throw Exception('Échec de l’envoi de la demande (${response.statusCode})');
    }
  }
}