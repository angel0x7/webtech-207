"use client";


import { useState } from "react";

export default function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-75 bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all"
      >
        <span>⚙️</span> Paramètres
      </button>

     
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-center">Paramètres</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Thème :
                </label>
                <select className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500">
                  <option>Sombre</option>
                  <option>Clair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Langue :
                </label>
                <select className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500">
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Espagnol</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                Fermer
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
