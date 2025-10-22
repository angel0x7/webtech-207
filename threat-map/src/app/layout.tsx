<<<<<<< HEAD

import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threat Map",
  description: "Visualisation des attaques avec Shodan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
=======
import Navbar from './components/Navbar';
import Footer from './components/footer';
import LoginButton from './components/loginBoton';
import SettingsButton from './components/SettingsButton';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
>>>>>>> 5f6366d3903a86b27bf6a534328a07e9e9a18e0b
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
<<<<<<< HEAD
          <Header />
=======
          <Navbar />
          <LoginButton />
          <SettingsButton />
          
>>>>>>> 5f6366d3903a86b27bf6a534328a07e9e9a18e0b
          <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
