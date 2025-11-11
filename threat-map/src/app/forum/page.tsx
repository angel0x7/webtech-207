"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../config/supabaseClient";
import NewQuestion from "../components/newQuestion";

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  profile?: { username?: string | null };
};

export default function ForumClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
        .from("question")
        .select(`
          id,
          titre,
          texte,
          created_at,
          profiles: idProfile ( username )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const normalized = (data as any[]).map((q: any) => ({
          id: q.id,
          titre: q.titre,
          texte: q.texte,
          created_at: q.created_at,
          profile: { username: Array.isArray(q.profiles) ? q.profiles[0]?.username : q.profiles?.username },
        }));
        setQuestions(normalized);
      }
      setLoading(false);
    }
    loadQuestions();
  }, []);

  function handleAddedQuestion(q: Question) {
    setQuestions((prev) => [q, ...prev]);
    setShowForm(false);
  }

  return (
    <section className="p-6 min-h-screen bg-[#0b0d2b] text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-400">Questions : {questions.length}</div>
        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Fermer" : "Ajouter une question"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <NewQuestion onPosted={handleAddedQuestion} />
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 animate-pulse">Chargement des questions…</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              onClick={() => router.push(`/forum/${q.id}`)}
              className="cursor-pointer bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:bg-gray-800 transition-all"
            >
              <h2 className="text-lg font-semibold text-blue-400">{q.titre}</h2>
              <p className="text-gray-300 mt-1 line-clamp-2">{q.texte}</p>
              <p className="text-xs text-gray-500 mt-2">
                Posté par {q.profile?.username ?? "Anonyme"} le{" "}
                {new Date(q.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
