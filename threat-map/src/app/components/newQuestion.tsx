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
  onPosted?: (q: Question) => void;
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
        body: JSON.stringify({
          titre,
          texte,
          idProfile: user.id,
        }),
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
      className="mb-4 space-y-2 p-4 border rounded bg-white"
    >
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <input
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        placeholder="Titre"
        className="w-full border rounded px-3 py-2"
        disabled={loading}
      />

      <textarea
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Décrivez votre question"
        className="w-full border rounded px-3 py-2"
        disabled={loading}
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Envoi..." : "Publier la question"}
        </button>
      </div>
    </form>
  );
}
