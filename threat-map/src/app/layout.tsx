import Navbar from './components/Navbar';
import Footer from './components/footer';
import SearchBar from './components/SearchBar';
import './globals.css';

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar />
          
          <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
