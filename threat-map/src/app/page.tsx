<<<<<<< HEAD
import RootLayout from "./layout";
import Layout from "./layout";
=======
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
>>>>>>> 5f6366d3903a86b27bf6a534328a07e9e9a18e0b

export default function Home() {
  const router = useRouter();

  return (
<<<<<<< HEAD
    
      <>
        <h1>Welcome to ThreatMap</h1>
        <p>This is the home page</p>
      </>
    
=======
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-y-auto">
      
      <section className="flex flex-col items-center justify-center text-center min-h-[100vh] px-6 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400">
            Welcome to <span className="text-green-400">ThreatMap</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Visualisez les attaques mondiales en temps réel et analysez les tendances cyber.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push("/map")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:scale-105"
            >
               Voir la carte en direct
            </button>

            <button
              onClick={() => router.push("/ip-search")}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:scale-105"
            >
               Ip Scanner
            </button>
          </div>
        </motion.div>
      </section>

   
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-8 text-center space-y-6 bg-gray-950 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-green-400 mb-2">
          Surveillance Globale des Menaces
        </h2>
        <p className="text-gray-400 max-w-3xl">
          ThreatMap collecte et corrèle en temps réel les attaques issues de multiples sources
          (honeypots, firewalls, flux OSINT...).  
          Notre visualisation 3D vous permet d’explorer les menaces de manière intuitive et stratégique.
        </p>
      </section>

      <section className="py-20 bg-gray-900 border-t border-gray-800 text-center">
        <h2 className="text-3xl font-bold text-blue-400 mb-10">Fonctionnalités clés</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-green-400 mb-2">🛰 Détection en Temps Réel</h3>
            <p className="text-gray-400 text-sm">
              Surveillez les IPs malveillantes, ports scannés et tendances d’attaques à la seconde.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-green-400 mb-2">🌐 Carte 3D Interactive</h3>
            <p className="text-gray-400 text-sm">
              Une vue globale du trafic hostile sur un globe 3D fluide et précis.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-green-400 mb-2">📊 Dashboard Analytique</h3>
            <p className="text-gray-400 text-sm">
              Analysez les statistiques, origines et cibles avec des visualisations avancées.
            </p>
          </div>
        </div>
      </section>


      
    </main>
>>>>>>> 5f6366d3903a86b27bf6a534328a07e9e9a18e0b
  );
}
