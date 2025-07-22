// lib/features/modules/naissance/naissance_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';
import 'package:govtech_mobile/core/services/api_service.dart'; // 🔥 Import ApiService
import 'dart:convert';

class DateInputFormatter extends TextInputFormatter {
  // Formate automatiquement en AAAA-MM-JJ
  @override
  TextEditingValue formatEditUpdate(TextEditingValue oldValue, TextEditingValue newValue) {
    var text = newValue.text;

    // Supprimer tout sauf chiffres
    text = text.replaceAll(RegExp(r'[^0-9]'), '');

    final buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      // Ajouter un tiret après la 4ème et 6ème position
      if ((i == 3 || i == 5) && i != text.length - 1) {
        buffer.write('-');
      }
    }

    final formatted = buffer.toString();
    return TextEditingValue(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}

// Validation stricte format ISO AAAA-MM-JJ
String? validateDateIso(String? value) {
  if (value == null || value.isEmpty) {
    return 'Champ requis';
  }
  final regex = RegExp(r'^\d{4}-\d{2}-\d{2}$');
  if (!regex.hasMatch(value)) {
    return 'Format invalide (AAAA-MM-JJ)';
  }
  try {
    final parts = value.split('-');
    final year = int.parse(parts[0]);
    final month = int.parse(parts[1]);
    final day = int.parse(parts[2]);
    final now = DateTime.now();

    if (year > now.year) return 'Année future non autorisée';
    if (month < 1 || month > 12) return 'Mois invalide';
    if (day < 1 || day > 31) return 'Jour invalide';

    final parsed = DateTime.tryParse(value);
    if (parsed == null || parsed.year != year || parsed.month != month || parsed.day != day) {
      return 'Date invalide';
    }
    return null;
  } catch (e) {
    return 'Date invalide';
  }
}

class NaissanceScreen extends StatefulWidget {
  const NaissanceScreen({Key? key}) : super(key: key);

  @override
  State<NaissanceScreen> createState() => _NaissanceScreenState();
}

class _NaissanceScreenState extends State<NaissanceScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nomController = TextEditingController();
  final TextEditingController _prenomController = TextEditingController();
  final TextEditingController _dateNaissanceController = TextEditingController();
  final TextEditingController _lieuNaissanceController = TextEditingController();
  final TextEditingController _nomPereController = TextEditingController();
  final TextEditingController _nomMereController = TextEditingController();

  bool _loading = false;

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    try {
      final data = {
        'nom': _nomController.text.trim(),
        'prenom': _prenomController.text.trim(),
        'dateNaissance': _dateNaissanceController.text.trim(),
        'lieuNaissance': _lieuNaissanceController.text.trim(),
        'nomPere': _nomPereController.text.trim(),
        'nomMere': _nomMereController.text.trim(),
      };

      final response = await ApiService.post('naissances', data, withAuth: true);

      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Demande soumise avec succès')),
        );
        _formKey.currentState!.reset();
      } else {
        final error = jsonDecode(response.body)['message'] ?? 'Erreur inconnue';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('❌ Échec : $error')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('💥 Erreur réseau : $e')),
      );
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Acte de Naissance'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _nomController,
                label: 'Nom',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _prenomController,
                label: 'Prénom',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _dateNaissanceController,
                label: 'Date de naissance (AAAA-MM-JJ)',
                keyboardType: TextInputType.number,
                inputFormatters: [DateInputFormatter()],
                validator: validateDateIso,
              ),
              InputField(
                controller: _lieuNaissanceController,
                label: 'Lieu de naissance',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _nomPereController,
                label: 'Nom du père',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _nomMereController,
                label: 'Nom de la mère',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              const SizedBox(height: 20),
              PrimaryButton(
                label: _loading ? 'Envoi en cours...' : 'Soumettre',
                onPressed: () {
                  if (!_loading) _submitForm();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}