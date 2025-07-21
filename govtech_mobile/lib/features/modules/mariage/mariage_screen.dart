import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';

class MariageScreen extends StatefulWidget {
  const MariageScreen({Key? key}) : super(key: key);

  @override
  State<MariageScreen> createState() => _MariageScreenState();
}

class _MariageScreenState extends State<MariageScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nomEpouxController = TextEditingController();
  final TextEditingController _nomEpouseController = TextEditingController();
  final TextEditingController _dateMariageController = TextEditingController();
  final TextEditingController _lieuMariageController = TextEditingController();

  bool _loading = false;

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loading = true;
      });

      // Simuler un appel à l'API
      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _loading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande de mariage soumise avec succès')),
      );

      _formKey.currentState!.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Acte de Mariage'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _nomEpouxController,
                label: 'Nom de l\'époux',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _nomEpouseController,
                label: 'Nom de l\'épouse',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _dateMariageController,
                label: 'Date du mariage (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
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