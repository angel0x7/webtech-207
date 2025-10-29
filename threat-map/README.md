# Threat Map — webtech-207

**Demo live:** [vercel_link](https://webtech-207.vercel.app/) 


## Description
Application Next.js TypeScript pour rechercher et visualiser des informations de sécurité sur des adresses IP : verdicts moteurs, RDAP/WHOIS, statistiques et exports. Interface sombre, composants réactifs et export JSON/CSV.

## Fonctionnalités
- Recherche d'une IP et affichage des attributs réseau (ASN, fournisseur, pays, CIDR).  
- Tableau des résultats des moteurs avec filtrage et export CSV.  
- Donut chart pour les statuts d'analyse.  
- Panneau RDAP/WHOIS avec copie et export JSON.  
- Actions utilitaires : copier IP, exporter JSON, blocage (placeholder).

## Stack
- Next.js (app router, `"use client"`)  
- React + TypeScript  
- Tailwind CSS  
- lucide-react (icônes)

## Installation locale
```bash
git clone https://github.com/angel0x7/webtech-207.git
cd webtech-207/threat-map
npm install
```
Variables d'environnement

Créez .env.local si nécessaire. Exemple :

NEXT_PUBLIC_API_BASE=https://api.example.com
VT_API_KEY=your_virustotal_api_key


Adapter selon l'implémentation du backend / des routes API.

Scripts utiles
```bash
npm run dev    # développement
npm run build  # build production
npm run start  # start production (après build)
```
