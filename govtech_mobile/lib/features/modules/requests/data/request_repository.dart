// features/modules/requests/data/request_repository.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../auth/data/auth_repository.dart';

class RequestRepository {
  final String baseUrl;

  RequestRepository({required this.baseUrl});

  Future<Map<String, dynamic>> fetchRequests() async {
    final authRepo = AuthRepository(baseUrl: baseUrl);
    final token = await authRepo.getToken();

    final response = await http.get(
      Uri.parse('$baseUrl/requests'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
          'Erreur lors de la récupération des demandes (${response.statusCode})');
    }
  }
}