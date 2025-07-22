// core/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/config/app_config.dart';

class ApiService {
  static final _storage = const FlutterSecureStorage();

  static Future<Map<String, String>> _getHeaders({bool withAuth = false}) async {
    final headers = {'Content-Type': 'application/json'};
    if (withAuth) {
      final token = await _storage.read(key: 'auth_token');
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  static Future<http.Response> post(String endpoint, Map<String, dynamic> data, {bool withAuth = false}) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}/$endpoint');
    final headers = await _getHeaders(withAuth: withAuth);
    return await http.post(url, body: json.encode(data), headers: headers);
  }

  static Future<http.Response> get(String endpoint, {bool withAuth = false}) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}/$endpoint');
    final headers = await _getHeaders(withAuth: withAuth);
    return await http.get(url, headers: headers);
  }
}