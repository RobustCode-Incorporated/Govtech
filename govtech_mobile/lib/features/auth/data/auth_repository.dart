import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'models/user_model.dart';

class AuthRepository {
  final String baseUrl;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthRepository({required this.baseUrl});

  // 🔐 Connexion
  Future<UserModel> login(String nuc, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'nuc': nuc, 'motDePasse': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final token = data['token'];
      await saveToken(token); // ✅ Sauvegarde du token

      return UserModel.fromJson(data['user']);
    } else {
      throw Exception('Échec de connexion');
    }
  }

  // 🧾 Enregistrement
  Future<UserModel> register(Map<String, dynamic> formData) async {
    final url = Uri.parse('$baseUrl/auth/register');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(formData),
    );

    print('Status: ${response.statusCode}');
    print('Body: ${response.body}');

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      final token = data['token'];
      await saveToken(token); // ✅ Sauvegarde du token

      return UserModel.fromJson(data['user']);
    } else {
      throw Exception('Échec d’enregistrement');
    }
  }

  // 🔑 Sauvegarde du token
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  // 🔓 Lecture du token
  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  // ❌ Suppression du token
  Future<void> clearToken() async {
    await _storage.delete(key: 'auth_token');
  }
}