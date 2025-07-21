// ✅ lib/core/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../core/config/app_config.dart';

class ApiService {
  static Future<http.Response> post(String endpoint, Map<String, dynamic> data) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}/$endpoint');
    return await http.post(url, body: json.encode(data), headers: {
      'Content-Type': 'application/json',
    });
  }

  static Future<http.Response> get(String endpoint) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}/$endpoint');
    return await http.get(url);
  }
}