import Header from "./header";
import Footer from "./footer";
import "../globals.css";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
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
