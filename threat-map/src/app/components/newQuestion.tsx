// components/NewQuestion.tsx
"use client";

import { useState } from "react";
import { supabase } from "../config/supabaseClient";

export default function NewQuestion() {
  const [titre, setTitre] = useState("");
  const [texte, setTexte] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("question").insert({ titre, texte, idProfile: null });
    setLoading(false);
    if (error) return alert(error.message);
    setTitre("");
    setTexte("");
    // simple: reload page to show new question (or update state)
    location.reload();
  }

  return (
    <form onSubmit={submit} className="mb-6 space-y-2">
      <input value={titre} onChange={(e)=>setTitre(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" />
      <textarea value={texte} onChange={(e)=>setTexte(e.target.value)} placeholder="Describe your question" className="w-full border rounded px-3 py-2" />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
        {loading ? "Posting…" : "Post question"}
      </button>
    </form>
  );
}
