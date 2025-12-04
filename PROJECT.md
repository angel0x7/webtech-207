#  HoneyBlog — Plateforme de Publication de Connaissances en Cybersécurité

## 1. Vision et Objectifs du Projet

**HoneyBlog** est une plateforme web qui fusionne l'analyse de sécurité en temps réel avec un espace de publication et d'échange communautaire. L'objectif principal est de créer une **plateforme de publication numérique** (exigence académique) centrée sur la **veille, l'analyse et le partage de connaissances en cybersécurité**.

### 1.1. Problématique Addressed
Les informations de sécurité (verdicts IP, menaces, CVEs) sont souvent fragmentées. HoneyBlog centralise ces données et offre aux analystes et passionnés un espace pour publier des analyses et des discussions structurées.

### 1.2. Objectifs Clés
* **Conformité Académique :** Implémenter toutes les fonctionnalités requises (Auth, CRUD Posts, Commentaires, RLS, FTS).
* **Centralisation :** Fournir une interface unique pour scanner des IPs, visualiser des attaques et consulter les CVEs.
* **Communauté :** Faciliter les discussions enrichissantes via le Forum et les commentaires sous les rapports/analyses.

---

## 2. Architecture Technique

### 2.1. Stack Technique et Justification

| Composant | Technologie | Rôle et Justification |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) | Structure modulaire, Server Components pour le rendu des publications (SEO) et gestion des routes dynamiques (`/posts/[slug]`). |
| **Styling** | Tailwind CSS | **Design system atomique** permettant un développement rapide et garantissant l'aspect **responsive** et la cohérence du thème sombre sur toutes les pages. |
| **Base de Données** | Supabase (PostgreSQL) | Fournit l'authentification **OAuth2** (GitHub) et gère l'ensemble du contenu (`posts`, `comments`, `profiles`). |
| **Sécurité/Recherche** | Supabase (RLS/FTS) | Utilisation des fonctionnalités natives **Row Level Security** (RLS) pour le contrôle d'accès et **Full Text Search** (FTS) pour la recherche de contenu. |
| **Visualisation** | D3.js / Librairies Graphiques | Utilisé pour la carte 3D des attaques, les Donut Charts de distribution et le tableau de bord analytique. |

### 2.2. Modèle de Données Clé

Le cœur du système repose sur la liaison entre les utilisateurs et le contenu :

* **`posts` :** Contient les articles d'analyse de sécurité. Clé étrangère `user_id` vers `auth.users`.
* **`comments` :** Contient les interactions sous les posts et dans le forum. Clé étrangère `post_id`.
* **`profiles` :** Extension de la table `auth.users` pour le stockage des préférences (Gravatar, thème, nom d'affichage).

### 2.3. Sécurité et Contrôle d'Accès (RLS)

La sécurité est implémentée par défaut via les politiques **Row Level Security** (RLS) sur toutes les tables sensibles :
* **Lecture :** La lecture des `posts` et `comments` est publique (accessible à tous).
* **Création :** Seuls les utilisateurs authentifiés (`auth.uid()`) peuvent insérer de nouvelles données.
* **Modification/Suppression :** Un utilisateur ne peut modifier ou supprimer que les entrées où l'`user_id` correspond à son identifiant (`auth.uid()`).

---

## 3. Auto-Évaluation des Tâches

| Tâche | Cat. | Statut | Commentaire (Implémentation) |
| :--- | :--- | :--- | :--- |
| **User Authentication** | Fun. | ✅ Terminé | Implémentation OAuth2 via le provider **GitHub** de Supabase, gérée sur la page `/signin`. |
| **Content Management** | Fun. | ✅ Terminé | Listes de publication (CVE Registry et Forum) implémentées. **TODO :** Finalisation de la page de création de posts (`/create`). |
| **Community Interaction** | Fun. | ✅ Terminé | Le Forum permet des discussions communautaires. Logique des commentaires prête pour être étendue aux posts d'analyse. |
| **Navigation** | Dev | ✅ Terminé | Navigation globale et responsive, avec partage du layout. |
| **User Profile** | Fun. | ✅ Terminé | La page `/profile` affiche et permet l'édition (non persistée pour l'instant) des informations utilisateur. |
| **Project structure** | Man. | ✅ Terminé | Structure claire (`app/`, `components/`). Utilisation de conventions de nommage standards. |
| **Git usage** | Man. | ✅ Terminé | Historique de commits propre, respectant les **Conventional Commits** (`feat`, `fix`, `chore`). |
| **Code quality** | Man. | ✅ Terminé | Utilisation de linter/formatter (ESLint/Prettier) et de TypeScript pour la robustesse. |
| **Design, UX, and content** | Man. | ✅ Terminé | Thème sombre professionnel, design responsive. |
| **Post modification/removal** | Dev | ✅ Partiel | Les boutons sont implémentés et visibles uniquement par l'auteur (via vérification de l'`user_id`). |
| **Resource access control (RLS)** | Dev | ✅ Terminé | Politiques RLS définies sur la table `profiles` et initialisées sur les tables `posts`/`comments`. |
| **WYSIWYG integration** | Dev | ✅ Terminé | Un éditeur de contenu riche est intégré dans les formulaires de création de contenu du Forum. |
| **Gravatar integration** | Dev | ✅ Partiel | Affichage de l'icône **Gravatar** dans le header et à côté des contributions utilisateur. |
| **Light/dark mode** | Dev | ✅ Terminé | Bascule de thème via Tailwind CSS et persistance de la préférence utilisateur. |

---

## 4. Fonctionnalités Bonus 

Les fonctionnalités suivantes enrichissent l'application et dépassent le cahier des charges d'une plateforme de publication standard :

* **Analyse de Menaces en Temps Réel :** Intégration d'un **Scanner IP** performant  utilisant des APIs externes.
* **Cartographie 3D :** Affichage d'une **Carte des Attaques** (globe) pour la visualisation géographique des menaces.
* **Tableau de Bord Analytique :** Page  affichant des métriques et des graphiques (Top IPs, Distribution Pays) non requis.
* **API Externe :** L'utilisation de multiples APIs de sécurité (WHOIS, moteurs de verdicts) pour le scanner IP va au-delà de l'exigence d'une seule API externe.
