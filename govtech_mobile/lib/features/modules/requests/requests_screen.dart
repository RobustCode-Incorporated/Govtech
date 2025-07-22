// features/modules/requests/requests_screen.dart

import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/config/app_config.dart';
import './data/request_repository.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  late Future<Map<String, dynamic>> _requestsFuture;

  @override
  void initState() {
    super.initState();
    final repository = RequestRepository(baseUrl: AppConfig.apiBaseUrl);
    _requestsFuture = repository.fetchRequests();
  }

  Widget _buildRequestList(String title, List<dynamic> items) {
    return ExpansionTile(
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      children: items.map((item) {
        return ListTile(
          title: Text("ID: ${item['id']}"),
          subtitle: Text("Date: ${item['createdAt'] ?? 'Non précisée'}"),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Mes Demandes")),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _requestsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Erreur : ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("Aucune demande trouvée."));
          }

          final data = snapshot.data!;
          return ListView(
            padding: const EdgeInsets.all(12),
            children: [
              _buildRequestList("Actes de naissance", data['naissances']),
              _buildRequestList("Actes de mariage", data['mariages']),
              _buildRequestList("Passeports", data['passeports']),
              _buildRequestList("Permis de conduire", data['permisConduire']),
            ],
          );
        },
      ),
    );
  }
}