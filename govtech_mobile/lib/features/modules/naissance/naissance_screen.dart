// lib/features/modules/naissance/naissance_screen.dart
import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';

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
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loading = true;
      });

      // Simuler un appel API ici
      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _loading = false;
      });

      // Afficher une confirmation
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande soumise avec succès')),
      );

      _formKey.currentState!.reset();
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
                label: 'Date de naissance (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
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
                  if (!_loading) {
                    _submitForm();
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