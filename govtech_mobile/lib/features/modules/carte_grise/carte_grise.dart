import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';

class CarteGriseScreen extends StatefulWidget {
  const CarteGriseScreen({Key? key}) : super(key: key);

  @override
  State<CarteGriseScreen> createState() => _CarteGriseScreenState();
}

class _CarteGriseScreenState extends State<CarteGriseScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _numeroChassisController = TextEditingController();
  final TextEditingController _marqueController = TextEditingController();
  final TextEditingController _modeleController = TextEditingController();
  final TextEditingController _dateAcquisitionController = TextEditingController();
  final TextEditingController _proprietaireController = TextEditingController();

  bool _loading = false;

  Future<void> _submitCarteGrise() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);

      // TODO: Connecter à l'API backend pour soumettre la demande
      await Future.delayed(const Duration(seconds: 2)); // Simulation

      setState(() => _loading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande de carte grise soumise avec succès')),
      );

      _formKey.currentState!.reset();
    }
  }

  @override
  void dispose() {
    _numeroChassisController.dispose();
    _marqueController.dispose();
    _modeleController.dispose();
    _dateAcquisitionController.dispose();
    _proprietaireController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demande de Carte Grise'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _numeroChassisController,
                label: 'Numéro de châssis',
                validator: (value) => value!.isEmpty ? 'Numéro de châssis requis' : null,
              ),
              InputField(
                controller: _marqueController,
                label: 'Marque',
                validator: (value) => value!.isEmpty ? 'Marque requise' : null,
              ),
              InputField(
                controller: _modeleController,
                label: 'Modèle',
                validator: (value) => value!.isEmpty ? 'Modèle requis' : null,
              ),
              InputField(
                controller: _dateAcquisitionController,
                label: 'Date d\'acquisition (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Date requise' : null,
              ),
              InputField(
                controller: _proprietaireController,
                label: 'Nom du propriétaire',
                validator: (value) => value!.isEmpty ? 'Propriétaire requis' : null,
              ),
              const SizedBox(height: 20),
              PrimaryButton(
                label: _loading ? 'Envoi en cours...' : 'Soumettre',
                onPressed: () {
                  if (!_loading) {
                    _submitCarteGrise();  
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