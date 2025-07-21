import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/config/app_config.dart';
import 'routes/app_router.dart';
import 'features/auth/logic/auth_provider.dart';
import 'features/auth/data/auth_repository.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AuthProvider(
            authRepository: AuthRepository(baseUrl: AppConfig.apiBaseUrl),
          ),
        ),
      ],
      child: const GovTechApp(),
    ),
  );
}

class GovTechApp extends StatelessWidget {
  const GovTechApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      theme: ThemeData(
        primaryColor: AppConfig.primaryColor,
        scaffoldBackgroundColor: Colors.white,
        fontFamily: 'Inter',
      ),
      debugShowCheckedModeBanner: false,
      onGenerateRoute: AppRouter.generateRoute,
      initialRoute: '/login',
    );
  }
}