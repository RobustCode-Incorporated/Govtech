import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/colors.dart';
import '../../auth/logic/auth_provider.dart';

class CitizenDashboard extends StatelessWidget {
  const CitizenDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    String fullName = '';
    if (user != null) {
      final postnom = (user.postnom != null && user.postnom!.isNotEmpty) ? ' ${user.postnom}' : '';
      fullName = '${user.prenom}$postnom ${user.nom}';
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(fullName.isNotEmpty ? 'Bonjour, $fullName' : 'Tableau de bord Citoyen'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _DashboardTile(
              title: 'Naissance',
              icon: Icons.child_care,
              onTap: () => Navigator.pushNamed(context, '/naissance'),
            ),
            _DashboardTile(
              title: 'Mariage',
              icon: Icons.favorite,
              onTap: () => Navigator.pushNamed(context, '/mariage'),
            ),
            _DashboardTile(
              title: 'Décès',
              icon: Icons.sentiment_very_dissatisfied,
              onTap: () => Navigator.pushNamed(context, '/deces'),
            ),
            _DashboardTile(
              title: 'Passeport',
              icon: Icons.book,
              onTap: () => Navigator.pushNamed(context, '/passeport'),
            ),
            _DashboardTile(
              title: 'Permis',
              icon: Icons.car_rental,
              onTap: () => Navigator.pushNamed(context, '/permis'),
            ),
            _DashboardTile(
              title: 'Profil',
              icon: Icons.person,
              onTap: () => Navigator.pushNamed(context, '/profile'),
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
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.primaryColor.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 36, color: AppColors.primaryColor),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }
}