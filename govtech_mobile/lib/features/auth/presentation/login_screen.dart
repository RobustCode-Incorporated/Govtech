import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/colors.dart';
import '../../../core/widgets/input_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../logic/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nucController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _loading = false;

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.login(_nucController.text, _passwordController.text);

    setState(() => _loading = false);

    if (authProvider.isAuthenticated) {
      final role = authProvider.user?.role;

      if (role == 'citoyen') {
        Navigator.pushReplacementNamed(context, '/citizen_dashboard');
      } else if (role == 'agent') {
        Navigator.pushReplacementNamed(context, '/agent_dashboard');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Rôle non reconnu')),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(authProvider.errorMessage ?? 'Erreur inconnue')),
      );
    }
  }

  @override
  void dispose() {
    _nucController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connexion'),
        backgroundColor: AppColors.primaryColor,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              InputField(
                label: 'NUC',
                controller: _nucController,
                keyboardType: TextInputType.text,
                validator: (value) =>
                    value!.isEmpty ? 'Veuillez entrer votre NUC' : null,
              ),
              const SizedBox(height: 16),
              InputField(
                label: 'Mot de passe',
                controller: _passwordController,
                isPassword: true,
                validator: (value) =>
                    value!.isEmpty ? 'Mot de passe requis' : null,
              ),
              const SizedBox(height: 24),
              PrimaryButton(
                label: _loading ? 'Connexion...' : 'Se connecter',
                onPressed: () {
                  if (!_loading) {
                    _handleLogin();
                  }
                },
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Pas de compte ? "),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/register');
                    },
                    child: const Text(
                      "Inscrivez-vous ici",
                      style: TextStyle(
                        color: Colors.blue,
                        decoration: TextDecoration.underline,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}