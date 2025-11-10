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

<img width="2845" height="1521" alt="image" src="https://github.com/user-attachments/assets/257cc5d7-cd8d-4898-92ca-ccc78ef34805" />


### Sign in Page

Simple sign up/log in page.

<img width="2834" height="1514" alt="image" src="https://github.com/user-attachments/assets/697b2713-0884-481a-9715-ce15b34d5303" />


### Attacks Information

This page begins with a globe showing the locations of recent vulnerabilities.

<img width="2830" height="1532" alt="image" src="https://github.com/user-attachments/assets/4f1c5fbf-46d8-4964-945b-180099f780b2" />


This page is also a network analytics dashboard showing total events, unique hosts/IPs, a country distribution pie, a top‑IPs bar chart, and a detailed IP table with counts, last activity, and country. 

<img width="2774" height="1307" alt="image" src="https://github.com/user-attachments/assets/7c45c3d2-3fbe-493a-a252-763d4e7260af" />


### Ip Address Scannner

A compact IP lookup tool: enter an IP (e.g., 185.24.96.105), click "Search" to view details, then export results, copy the entry, or block the IP directly from the interface.

<img width="2853" height="795" alt="image" src="https://github.com/user-attachments/assets/1123cfd9-9d9c-4278-82dd-ad273747d925" />


## CVE Registry

This page lists the latest CVEs. 

<img width="2819" height="1507" alt="image" src="https://github.com/user-attachments/assets/5ceef00f-c0f8-4f26-8800-1b3fc68d06e4" />


## Forum Page

On this page, users can ask questions about cybersecurity and many other topics. Anyone can answer questions, which enriches discussions within the community.

<img width="2879" height="1076" alt="image" src="https://github.com/user-attachments/assets/db431fb6-9d08-43a7-bdf1-f9c84e81ebff" />
