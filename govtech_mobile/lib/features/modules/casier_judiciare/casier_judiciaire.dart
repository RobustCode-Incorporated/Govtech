import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';

class CasierJudiciaireScreen extends StatefulWidget {
  const CasierJudiciaireScreen({Key? key}) : super(key: key);

  @override
  State<CasierJudiciaireScreen> createState() => _CasierJudiciaireScreenState();
}

class _CasierJudiciaireScreenState extends State<CasierJudiciaireScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _citizenNucController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();

  bool _loading = false;

  Future<void> _submitCasier() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);

      // TODO: Connecter à l'API backend pour soumettre la demande de casier judiciaire

      await Future.delayed(const Duration(seconds: 2)); // Simulation de délai

      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande de casier judiciaire soumise avec succès')),
      );

      _formKey.currentState!.reset();
    }
  }

  @override
  void dispose() {
    _citizenNucController.dispose();
    _detailsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demande Casier Judiciaire'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _citizenNucController,
                label: 'NUC du citoyen',
                validator: (value) => value!.isEmpty ? 'NUC requis' : null,
              ),
              InputField(
                controller: _detailsController,
                label: 'Détails ou motif',
                maxLines: 3,
                validator: (value) => value!.isEmpty ? 'Veuillez fournir les détails' : null,
              ),
              const SizedBox(height: 20),
              PrimaryButton(
                label: _loading ? 'Envoi en cours...' : 'Soumettre',
                onPressed: () {
                  if (!_loading) {
                  _submitCasier();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}