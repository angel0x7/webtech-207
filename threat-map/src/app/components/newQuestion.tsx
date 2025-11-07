"use client";

import { useState } from "react";
import { supabase } from "../config/supabaseClient"; 
//@typescript-eslint/no-explicit-any
export default function NewQuestion({ onPosted }: { onPosted?: (q: any) => void }) {
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titre.trim() && !texte.trim()) {
      setError("Title or text required");
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

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to post question");

      setTitre("");
      setTexte("");
      if (onPosted) onPosted(payload);
      //@typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2 p-4 border rounded bg-white">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" />
      <textarea value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Describe your question" className="w-full border rounded px-3 py-2" />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? "Posting…" : "Post question"}
        </button>
      </div>
    </form>
  );
}
