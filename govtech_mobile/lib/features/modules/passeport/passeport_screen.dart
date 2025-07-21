import 'package:flutter/material.dart';
import 'package:govtech_mobile/core/constants/colors.dart';
import 'package:govtech_mobile/core/widgets/primary_button.dart';
import 'package:govtech_mobile/core/widgets/input_field.dart';

class PasseportScreen extends StatefulWidget {
  const PasseportScreen({Key? key}) : super(key: key);

  @override
  State<PasseportScreen> createState() => _PasseportScreenState();
}

class _PasseportScreenState extends State<PasseportScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nomController = TextEditingController();
  final TextEditingController _prenomController = TextEditingController();
  final TextEditingController _dateNaissanceController = TextEditingController();
  final TextEditingController _dateEmissionController = TextEditingController();
  final TextEditingController _dateExpirationController = TextEditingController();

  String? _typePasseport;
  String _typeDemande = 'Nouvelle demande'; // par défaut

  bool _loading = false;

  final List<String> _typeDemandes = ['Nouvelle demande', 'Renouvellement'];
  final List<String> _typesPasseport = ['Biométrique', 'Officiel', 'Diplomatique'];

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _loading = true;
      });

      // TODO: appel API pour envoyer les données, en tenant compte du typeDemande

      await Future.delayed(const Duration(seconds: 2));

      setState(() {
        _loading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Demande de passeport ($_typeDemande) soumise avec succès')),
      );

      _formKey.currentState!.reset();
      setState(() {
        _typeDemande = 'Nouvelle demande';
        _typePasseport = null;
      });
    }
  }

  String? _validateDateExpiration(String? value) {
    if (_typeDemande == 'Renouvellement' && (value == null || value.isEmpty)) {
      return 'La date d\'expiration est obligatoire pour un renouvellement';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Demande de Passeport'),
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
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Type de demande'),
                value: _typeDemande,
                items: _typeDemandes
                    .map((type) => DropdownMenuItem(value: type, child: Text(type)))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _typeDemande = value!;
                  });
                },
              ),
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Type de passeport'),
                value: _typePasseport,
                items: _typesPasseport
                    .map((type) => DropdownMenuItem(value: type, child: Text(type)))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _typePasseport = value;
                  });
                },
                validator: (value) => value == null ? 'Champ requis' : null,
              ),
              InputField(
                controller: _dateEmissionController,
                label: 'Date d\'émission (JJ/MM/AAAA)',
                keyboardType: TextInputType.datetime,
                validator: (value) => value!.isEmpty ? 'Champ requis' : null,
              ),
              if (_typeDemande == 'Renouvellement')
                InputField(
                  controller: _dateExpirationController,
                  label: 'Date d\'expiration (JJ/MM/AAAA)',
                  keyboardType: TextInputType.datetime,
                  validator: _validateDateExpiration,
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