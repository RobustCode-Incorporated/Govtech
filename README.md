# GovTech Backend API

API backend pour la gestion des services administratifs numériques (Etat Civil, Passeports, Permis, etc.)  
Développée avec Node.js, Express et Sequelize (PostgreSQL).

---

## Fonctionnalités principales

- Gestion des citoyens (inscription, authentification, profils)
- Gestion des rôles (citoyen, agent, administrateur)
- Modules d’état civil : Naissance, Mariage, Décès, Résidence
- Gestion des documents officiels : Passeport, Permis de conduire, Casier judiciaire, Carte grise
- Système de permissions par module pour les agents
- Authentification JWT sécurisée
- Protection des routes selon rôles et permissions

---

## Installation et lancement

### Prérequis

- Node.js (v18+ recommandé)
- PostgreSQL configuré et en cours d’exécution
- `.env` avec variables :




Setup
	1.	Cloner le repo
git clone https://github.com/tonuser/govtech-backend.git
cd govtech-backend

	2.	Installer les dépendances
npm install
3.	Lancer la base de données (PostgreSQL)
	4.	Démarrer le serveur (dev mode avec nodemon)

npx nodemon app.js
Architecture du projet

/models       # Modèles Sequelize (Citoyen, Naissance, Passeport, etc.)
/routes       # Routes Express API (citizenRoutes, adminRoutes, etc.)
/middlewares  # Middlewares auth, roles, permissions
/config       # Configuration base de données
/utils        # Utilitaires (ex : génération NUC)
/app.js       # Point d’entrée du serveur

Routes principales
Route
Méthode
Accès
Description
/api/citizens/register
POST
Public
Inscription citoyen
/api/citizens/login
POST
Public
Authentification JWT
/api/citizens/profile
GET
Citoyen, Agent, Admin
Récupérer profil utilisateur
/api/admin/create-admin
POST
Admin
Création administrateur
/api/admin/citizens
GET
Admin
Liste tous les citoyens
/api/admin/citizens/:id/role
PUT
Admin
Modifier rôle citoyen
/api/admin/citizens/:id
DELETE
Admin, Agent
Supprimer citoyen
/api/naissances
…
Authenticated
CRUD Naissance
/api/passeports
…
Authenticated
CRUD Passeport
(et autres modules similaires)


Sécurité
	•	JWT pour authentification stateless
	•	Middleware authMiddleware vérifie token
	•	Middleware roleMiddleware contrôle accès selon rôle
	•	Permissions dynamiques pour agents (par module)

⸻

Roadmap (v2+)
	•	Gestion workflows validation/demandes
	•	Audit et logs des actions
	•	Génération PDF des documents officiels
	•	Interface frontend (React / Flutter)
	•	Déploiement production (CI/CD)

⸻


⸻

Licence

MIT License
