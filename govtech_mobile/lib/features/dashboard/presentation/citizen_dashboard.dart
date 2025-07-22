import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

import '../../../core/constants/colors.dart';
import '../../auth/logic/auth_provider.dart';

class CitizenDashboard extends StatelessWidget {
  const CitizenDashboard({super.key});

  Future<void> _copyNUC(BuildContext context, String nuc) async {
    await Clipboard.setData(ClipboardData(text: nuc));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('NUC copié dans le presse-papiers')),
    );
  }

  Future<void> _generatePdf(BuildContext context, String nuc, String fullName) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        build: (context) => pw.Padding(
          padding: const pw.EdgeInsets.all(24),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'Relevé d\'identité citoyenne',
                style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold),
              ),
              pw.SizedBox(height: 20),
              pw.Text('Nom complet : $fullName', style: pw.TextStyle(fontSize: 18)),
              pw.Text('NUC : $nuc', style: pw.TextStyle(fontSize: 18)),
            ],
          ),
        ),
      ),
    );

    await Printing.layoutPdf(onLayout: (format) => pdf.save());
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    String fullName = '';
    String nuc = '';

    if (user != null) {
      final postnom = (user.postnom != null && user.postnom!.isNotEmpty) ? ' ${user.postnom}' : '';
      fullName = '${user.prenom}$postnom ${user.nom}';
      nuc = user.nuc ?? '';
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(fullName.isNotEmpty ? 'Bonjour, $fullName' : 'Tableau de bord Citoyen'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (nuc.isNotEmpty) ...[
              const Text('Votre numéro unique de citoyen (NUC) :', style: TextStyle(fontSize: 16)),
              const SizedBox(height: 6),
              SelectableText(nuc, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Row(
                children: [
                  ElevatedButton.icon(
                    onPressed: () => _copyNUC(context, nuc),
                    icon: const Icon(Icons.copy),
                    label: const Text('Copier le NUC'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: () => _generatePdf(context, nuc, fullName),
                    icon: const Icon(Icons.picture_as_pdf),
                    label: const Text('Télécharger le PDF'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
            ],
            Expanded(
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
                    title: 'Carte Grise',
                    icon: Icons.directions_car,
                    onTap: () => Navigator.pushNamed(context, '/carte_grise'),
                  ),
                  _DashboardTile(
                    title: 'Casier Judiciaire',
                    icon: Icons.gavel,
                    onTap: () => Navigator.pushNamed(context, '/casier'),
                  ),
                  _DashboardTile(
                    title: 'Profil',
                    icon: Icons.person,
                    onTap: () => Navigator.pushNamed(context, '/profile'),
                  ),
                ],
              ),
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