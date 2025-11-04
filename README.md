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


Scripts utiles
```bash
npm run dev    # développement
npm run build  # build production
npm run start  # start production (après build)
```

## Pages

### Home Page

Home page where you have access to the Attacks Map/Information and the IP scanner.

<img width="2840" height="1529" alt="image" src="https://github.com/user-attachments/assets/09c05ebf-208f-4894-8f91-0745fb41b2a2" />


### Sign up Page

Simple sign up/log in page.

<img width="2839" height="1525" alt="image" src="https://github.com/user-attachments/assets/d9898896-c509-493d-8569-e0b9c6833b94" />


### Attacks Information
This page is a network analytics dashboard showing total events, unique hosts/IPs, a country distribution pie, a top‑IPs bar chart, and a detailed IP table with counts, last activity, and country. 

<img width="2788" height="1522" alt="image" src="https://github.com/user-attachments/assets/f84cd88f-468b-43f8-84b7-b211e2ccd451" />


### Ip Address Scannner

A compact IP lookup tool: enter an IP (e.g., 185.24.96.105), click "Search" to view details, then export results, copy the entry, or block the IP directly from the interface.

<img width="2849" height="1377" alt="image" src="https://github.com/user-attachments/assets/8e8db82d-8dc5-4ec6-8db6-3b007a70e507" />
