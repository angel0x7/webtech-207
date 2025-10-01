import './globals.css'

export const metadata = {
  title: 'Mon appli',
  description: 'Application Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}