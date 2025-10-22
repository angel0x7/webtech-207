import Navbar from './components/Navbar';
import Footer from './components/footer';
import LoginButton from './components/loginBoton';
import SettingsButton from './components/SettingsButton';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          <LoginButton />
          <SettingsButton />
          
          <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
