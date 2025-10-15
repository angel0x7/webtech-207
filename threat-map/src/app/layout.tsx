
import Header from './components/header';
import Footer from './components/footer';
import './globals.css'; 

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
      
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', maxHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
          <Footer />
        </div>
      
  );
}