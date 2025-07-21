// features/auth/presentation/register_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/colors.dart';
import '../../../core/widgets/input_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../logic/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nomController = TextEditingController();
  final TextEditingController _postnomController = TextEditingController();
  final TextEditingController _prenomController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _dateNaissanceController = TextEditingController();
  final TextEditingController _communeController = TextEditingController();
  final TextEditingController _adresseController = TextEditingController();
  final TextEditingController _numeroTelController = TextEditingController();

  String? _selectedGenre;
  final List<String> _genres = ['Homme', 'Femme'];

  final _dateInputFormatter = TextInputFormatter.withFunction(
    (oldValue, newValue) {
      var text = newValue.text;
      if (text.length == 4 || text.length == 7) {
        if (!text.endsWith('-')) {
          text += '-';
        }
      }
      return TextEditingValue(
        text: text,
        selection: TextSelection.collapsed(offset: text.length),
      );
    },
  );

  void _handleRegister(AuthProvider authProvider) async {
    if (_formKey.currentState!.validate()) {
      await authProvider.register({
        'nom': _nomController.text.trim(),
        'postnom': _postnomController.text.trim(),
        'prenom': _prenomController.text.trim(),
        'motDePasse': _passwordController.text.trim(),
        'date_naissance': _dateNaissanceController.text.trim(),
        'genre': _selectedGenre ?? '',
        'commune': _communeController.text.trim(),
        'adresse': _adresseController.text.trim(),
        'numeroTel': _numeroTelController.text.trim(),
      });

      if (authProvider.isAuthenticated) {
        Navigator.pushReplacementNamed(context, '/citizen_dashboard');
      } else if (authProvider.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(authProvider.errorMessage!)),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Inscription')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              InputField(label: 'Nom', controller: _nomController),
              const SizedBox(height: 12),
              InputField(label: 'Post-nom', controller: _postnomController),
              const SizedBox(height: 12),
              InputField(label: 'Prénom', controller: _prenomController),
              const SizedBox(height: 12),
              InputField(label: 'Mot de passe', controller: _passwordController, isPassword: true),
              const SizedBox(height: 12),
              TextFormField(
                controller: _dateNaissanceController,
                keyboardType: TextInputType.number,
                inputFormatters: [_dateInputFormatter],
                decoration: const InputDecoration(
                  labelText: 'Date de naissance (YYYY-MM-DD)',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Veuillez entrer la date de naissance';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedGenre,
                items: _genres.map((genre) {
                  return DropdownMenuItem(value: genre, child: Text(genre));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedGenre = value;
                  });
                },
                decoration: const InputDecoration(labelText: 'Genre'),
                validator: (value) => value == null ? 'Veuillez sélectionner un genre' : null,
              ),
              const SizedBox(height: 12),
              InputField(label: 'Commune', controller: _communeController),
              const SizedBox(height: 12),
              InputField(label: 'Adresse', controller: _adresseController),
              const SizedBox(height: 12),
              InputField(label: 'Numéro de téléphone', controller: _numeroTelController),
              const SizedBox(height: 20),
              authProvider.isLoading
                  ? const CircularProgressIndicator()
                  : PrimaryButton(
                      label: 'Créer un compte',
                      onPressed: () => _handleRegister(authProvider),
                    ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Vous avez déjà un compte ? '),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacementNamed(context, '/login');
                    },
                    child: const Text(
                      'Connectez-vous ici',
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}