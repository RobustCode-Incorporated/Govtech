import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';

class DecesScreen extends StatefulWidget {
  const DecesScreen({Key? key}) : super(key: key);

  @override
  State<DecesScreen> createState() => _DecesScreenState();
}

class _DecesScreenState extends State<DecesScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nomDecedeController = TextEditingController();
  final TextEditingController _dateDecesController = TextEditingController();
  final TextEditingController _lieuDecesController = TextEditingController();
  final TextEditingController _causeDecesController = TextEditingController();

  bool _loading = false;

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loading = true;
      });

      // Simuler un appel API
      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _loading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Déclaration de décès soumise avec succès')),
      );

      _formKey.currentState!.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Déclaration de Décès'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              InputField(
                controller: _nomDecedeController,
                label: 'Nom du défunt',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _dateDecesController,
                label: 'Date du décès (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _lieuDecesController,
                label: 'Lieu du décès',
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              InputField(
                controller: _causeDecesController,
                label: 'Cause du décès',
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