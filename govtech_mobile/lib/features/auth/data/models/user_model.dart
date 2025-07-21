class UserModel {
  final String id;
  final String nom;
  final String? postnom; // nullable car optionnel
  final String prenom;
  final String token;
  final String role;

  UserModel({
    required this.id,
    required this.nom,
    this.postnom,
    required this.prenom,
    required this.token,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id']?.toString() ?? '',
      nom: json['nom'] ?? '',
      postnom: json['postnom'], // peut être null
      prenom: json['prenom'] ?? '',
      token: json['token'] ?? '',
      role: json['role'] ?? '',
    );
  }
}