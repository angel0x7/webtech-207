'use client'

export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold mb-6 text-cyan-300"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          Crédits et Sources
        </h1>

        <p className="mb-8 text-gray-400">
          Merci aux tutoriels, APIs et ressources externes qui ont contribué à la création de ce projet.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Tutoriels YouTube</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a
                href="https://youtu.be/xk4u7v-KtvY?si=8_8Kn_ywPnbALWwo"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-200"
              >
                React basics — Web Dev Simplified
              </a>
            </li>
            <li>
              <a
                href="https://youtu.be/vM8M4QloVL0?si=P8AJoSrBth4UO2vU"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-200"
              >
                Globe interactif / visualisation
              </a>
            </li>
            <li>
              <a
                href="https://youtu.be/CXa0f4-dWi4?si=0LRnYWvJiOa8Tovg"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-200"
              >
                Navbar responsive / Sidebar
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-3">APIs et données</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a
                href="https://app.opencve.io/api/cve"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-200"
              >
                OpenCVE API
              </a>
            </li>
            <li>
              <a
                href="https://honeydb.io"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-cyan-200"
              >
                HoneyDB
              </a>
            </li>
            <li>VirusTotal API </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Frameworks et librairies</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Next.js</li>
            <li>Tailwind CSS</li>
            <li>Lucide / Heroicons (icônes)</li>
          </ul>
        </section>

        <section className="mt-12 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Angel. Tous droits réservés.
          </p>
          <p className="mt-2">
            Les contenus, logos et noms de tiers mentionnés ici appartiennent à leurs propriétaires
            respectifs. Cette application utilise des APIs et ressources externes à des fins
            d&apos;analyse et de visualisation.
          </p>
        </section>
      </div>
    </div>
  )
}
