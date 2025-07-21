import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';

class AgentDashboard extends StatelessWidget {
  const AgentDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tableau de bord Agent'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          children: [
            _DashboardTile(
              title: 'Naissance',
              icon: Icons.child_care,
              onTap: () {
                Navigator.pushNamed(context, '/naissance');
              },
            ),
            _DashboardTile(
              title: 'Mariage',
              icon: Icons.favorite,
              onTap: () {
                Navigator.pushNamed(context, '/mariage');
              },
            ),
            _DashboardTile(
              title: 'Décès',
              icon: Icons.sentiment_very_dissatisfied,
              onTap: () {
                Navigator.pushNamed(context, '/deces');
              },
            ),
            _DashboardTile(
              title: 'Passeport',
              icon: Icons.document_scanner,
              onTap: () {
                Navigator.pushNamed(context, '/passeport');
              },
            ),
            _DashboardTile(
              title: 'Permis de conduire',
              icon: Icons.directions_car,
              onTap: () {
                Navigator.pushNamed(context, '/permis');
              },
            ),
            _DashboardTile(
              title: 'Résidence',
              icon: Icons.home,
              onTap: () {
                Navigator.pushNamed(context, '/residence');
              },
            ),
            _DashboardTile(
              title: 'Casier Judiciaire',
              icon: Icons.gavel,
              onTap: () {
                Navigator.pushNamed(context, '/casier');
              },
            ),
            _DashboardTile(
              title: 'Carte Grise',
              icon: Icons.car_rental,
              onTap: () {
                Navigator.pushNamed(context, '/cartegrise');
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardTile extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;

  const _DashboardTile({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 40, color: AppColors.primaryColor),
              const SizedBox(height: 10),
              Text(
                title,
                style: const TextStyle(fontSize: 16),
              )
            ],
          ),
        ),
      ),
    );
  }
}