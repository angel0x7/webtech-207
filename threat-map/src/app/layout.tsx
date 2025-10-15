
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
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Header />
          <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
