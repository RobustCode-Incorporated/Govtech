import 'package:flutter/material.dart';
import '../data/profile_repository.dart';

class ProfileScreen extends StatefulWidget {
  final String baseUrl;

  const ProfileScreen({Key? key, required this.baseUrl}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<Map<String, dynamic>> _profileFuture;

  @override
  void initState() {
    super.initState();
    final repository = ProfileRepository(baseUrl: widget.baseUrl);
    _profileFuture = repository.fetchProfile();
  }

  void _refreshProfile() {
    setState(() {
      final repository = ProfileRepository(baseUrl: widget.baseUrl);
      _profileFuture = repository.fetchProfile();
    });
  }

  Widget _buildField(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("$label: ",
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Expanded(
            child: Text(value ?? '', style: const TextStyle(fontSize: 16)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Profil'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshProfile,
            tooltip: 'Rafraîchir',
          ),
        ],
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _profileFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Text('Erreur : ${snapshot.error}',
                  style: const TextStyle(color: Colors.red)),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('Aucune donnée reçue.'));
          }

          final data = snapshot.data!;
          return Padding(
            padding: const EdgeInsets.all(16),
            child: ListView(
              children: [
                _buildField('Nom', data['nom']),
                _buildField('Postnom', data['postnom']),
                _buildField('Prénom', data['prenom']),
                _buildField('NUC', data['nuc']),
                _buildField('Rôle', data['role']),
                _buildField('Genre', data['genre']),
                _buildField('Date de naissance', data['date_naissance']),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  icon: const Icon(Icons.list_alt),
                  label: const Text('Mes demandes'),
                  onPressed: () {
                    Navigator.pushNamed(context, '/requests');
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}