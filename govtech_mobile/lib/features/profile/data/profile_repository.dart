// features/profile/data/profile_repository.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../auth/data/auth_repository.dart';

class ProfileRepository {
  final String baseUrl;

  ProfileRepository({required this.baseUrl});

  Future<Map<String, dynamic>> fetchProfile() async {
    final authRepo = AuthRepository(baseUrl: baseUrl); // ✅ Instancier correctement avec baseUrl
    final token = await authRepo.getToken(); // 🔐 Récupérer le token sécurisé

    final response = await http.get(
      Uri.parse('$baseUrl/citizens/profile'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token', // ✅ Ajout conditionnel du token
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['citizen'];
    } else {
      throw Exception('Erreur lors de la récupération du profil : ${response.statusCode}');
    }
  }
}