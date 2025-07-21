import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';

class ResidenceScreen extends StatefulWidget {
  const ResidenceScreen({Key? key}) : super(key: key);

  @override
  State<ResidenceScreen> createState() => _ResidenceScreenState();
}

class _ResidenceScreenState extends State<ResidenceScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _adresseController = TextEditingController();
  final TextEditingController _communeController = TextEditingController();
  final TextEditingController _dateInstallationController = TextEditingController();

  bool _loading = false;

  Future<void> _submitResidence() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);

      // TODO: Appeler API backend pour envoyer les infos

      await Future.delayed(const Duration(seconds: 2)); // Simulation attente

      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Résidence enregistrée avec succès')),
      );

      _formKey.currentState!.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Déclaration de Résidence'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _adresseController,
                label: 'Adresse complète',
                validator: (value) => value!.isEmpty ? 'Adresse requise' : null,
              ),
              InputField(
                controller: _communeController,
                label: 'Commune',
                validator: (value) => value!.isEmpty ? 'Commune requise' : null,
              ),
              InputField(
                controller: _dateInstallationController,
                label: 'Date d\'installation (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Date requise' : null,
              ),
              const SizedBox(height: 20),
              PrimaryButton(
                label: _loading ? 'Envoi en cours...' : 'Soumettre',
                onPressed: () {
                  if (!_loading) {
                     _submitResidence();
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