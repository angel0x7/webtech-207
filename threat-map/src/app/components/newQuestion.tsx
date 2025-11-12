"use client";

import { useState } from "react";
import { supabase } from "../config/supabaseClient";

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profile?: { username?: string | null };
};

type NewQuestionProps = {
  onPosted?: (q: { id: number; titre: string | null; texte: string | null; created_at: string; profile?: { username?: string | null } }) => void;
};

export default function NewQuestion({ onPosted }: NewQuestionProps) {
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!titre.trim() && !texte.trim()) {
      setError("Un titre ou un texte est requis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw new Error(authErr.message);

      const user = authData?.user;
      if (!user) throw new Error("Utilisateur non connecté");

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, texte, idProfile: user.id }),
      });

      const payload: Question | { message?: string } = await res.json();

      if (!res.ok) {
        const message =
          typeof payload === "object" && "message" in payload
            ? payload.message
            : "Erreur lors de la création de la question";
        throw new Error(message);
      }

      setTitre("");
      setTexte("");
      if (onPosted && "id" in payload) onPosted(payload);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur inattendue";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-6 bg-gray-900/70 border border-gray-700 rounded-2xl shadow-lg text-gray-100"
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-400">
        Poser une nouvelle question
      </h2>

      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
        className="w-full border border-gray-700 bg-gray-800/70 text-gray-100 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />

      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Décrivez votre question..."
        className="w-full border border-gray-700 bg-gray-800/70 text-gray-100 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
        rows={4}
      />

      <button
        type="submit"
        className={`px-5 py-2.5 rounded-lg font-medium transition ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-500"
        } text-white`}
        disabled={loading}
      >
        {loading ? "Envoi..." : "Publier la question"}
      </button>
    </form>
  );
}
