import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';
import 'package:govtech_mobile/features/modules/mariage/data/mariage_repository.dart';
import 'package:govtech_mobile/core/config/app_config.dart';

class MariageScreen extends StatefulWidget {
  const MariageScreen({Key? key}) : super(key: key);

  @override
  State<MariageScreen> createState() => _MariageScreenState();
}

class _MariageScreenState extends State<MariageScreen> {
  final _formKey = GlobalKey<FormState>();

  // ÉPOUX
  final TextEditingController _epouxPrenomController = TextEditingController();
  final TextEditingController _epouxPostnomController = TextEditingController();
  final TextEditingController _epouxNomController = TextEditingController();

  // ÉPOUSE
  final TextEditingController _epousePrenomController = TextEditingController();
  final TextEditingController _epousePostnomController = TextEditingController();
  final TextEditingController _epouseNomController = TextEditingController();

  // MARIAGE
  final TextEditingController _dateMariageController = TextEditingController();
  final TextEditingController _lieuMariageController = TextEditingController();

  bool _loading = false;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
      helpText: 'Sélectionnez la date du mariage',
    );

    if (picked != null) {
      setState(() {
        _dateMariageController.text = picked.toIso8601String().split('T').first;
      });
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);

      final mariageRepo = MariageRepository(baseUrl: AppConfig.apiBaseUrl);

      try {
        await mariageRepo.submitMariageRequest(
          epouxPrenom: _epouxPrenomController.text.trim(),
          epouxPostnom: _epouxPostnomController.text.trim(),
          epouxNom: _epouxNomController.text.trim(),
          epousePrenom: _epousePrenomController.text.trim(),
          epousePostnom: _epousePostnomController.text.trim(),
          epouseNom: _epouseNomController.text.trim(),
          dateMariage: _dateMariageController.text.trim(),
          lieuMariage: _lieuMariageController.text.trim(),
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Demande de mariage soumise avec succès')),
        );

        _formKey.currentState!.reset();
        _dateMariageController.clear();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur lors de l’envoi : ${e.toString()}')),
        );
      } finally {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demande d\'acte de mariage'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              const Text("Informations de l'époux", style: TextStyle(fontWeight: FontWeight.bold)),
              InputField(
                controller: _epouxPrenomController,
                label: 'Prénom de l\'époux',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _epouxPostnomController,
                label: 'Post-nom de l\'époux (optionnel)',
              ),
              InputField(
                controller: _epouxNomController,
                label: 'Nom de famille de l\'époux',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              const SizedBox(height: 12),

              const Text("Informations de l'épouse", style: TextStyle(fontWeight: FontWeight.bold)),
              InputField(
                controller: _epousePrenomController,
                label: 'Prénom de l\'épouse',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _epousePostnomController,
                label: 'Post-nom de l\'épouse (optionnel)',
              ),
              InputField(
                controller: _epouseNomController,
                label: 'Nom de famille de l\'épouse',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              const SizedBox(height: 12),

              const Text("Informations du mariage", style: TextStyle(fontWeight: FontWeight.bold)),
              GestureDetector(
                onTap: () => _selectDate(context),
                child: AbsorbPointer(
                  child: InputField(
                    controller: _dateMariageController,
                    label: 'Date du mariage (AAAA-MM-JJ)',
                    validator: (value) => value!.isEmpty ? 'Champ requis' : null,
                  ),
                ),
              ),
              InputField(
                controller: _lieuMariageController,
                label: 'Lieu du mariage',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              const SizedBox(height: 20),

              PrimaryButton(
                label: _loading ? 'Envoi en cours...' : 'Soumettre',
                onPressed: () {
                  if (!_loading) {
                    _submitForm(); // ✅ correction ici
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