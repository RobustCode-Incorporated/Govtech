import 'package:flutter/material.dart';

// Import des écrans
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/dashboard/presentation/citizen_dashboard.dart';
import '../features/dashboard/presentation/agent_dashboard.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../features/modules/naissance/naissance_screen.dart';
import '../features/modules/mariage/mariage_screen.dart';
import '../features/modules/deces/deces_screen.dart';
import '../features/modules/passeport/passeport_screen.dart';
import '../features/modules/permis/permis_screen.dart';

class AppRouter {
  static Route<dynamic>? generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/login':
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case '/register':
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case '/citizen_dashboard':
        return MaterialPageRoute(builder: (_) => const CitizenDashboard());
      case '/agent_dashboard':
        return MaterialPageRoute(builder: (_) => const AgentDashboard());
      case '/profile':
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        return MaterialPageRoute(
          builder: (_) => ProfileScreen(baseUrl: args['baseUrl'] ?? ''),
        );
      case '/naissance':
        return MaterialPageRoute(builder: (_) => const NaissanceScreen());
      case '/mariage':
        return MaterialPageRoute(builder: (_) => const MariageScreen());
      case '/deces':
        return MaterialPageRoute(builder: (_) => const DecesScreen());
      case '/passeport':
        return MaterialPageRoute(builder: (_) => const PasseportScreen());
      case '/permis':
        return MaterialPageRoute(builder: (_) => const PermisScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('Pas de route définie pour ${settings.name}'),
            ),
          ),
        );
    }
  }
}