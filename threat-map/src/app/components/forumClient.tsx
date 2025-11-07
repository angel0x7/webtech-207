"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import QuestionCard from "./questionCard";
import NewQuestion from "./newQuestion";

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profile?: { username?: string | null };
};

export default function ForumClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("question")
          .select("id,titre,texte,created_at,idProfile,profiles(username)")
          .order("created_at", { ascending: false });

        if (!error && data && mounted) {
          const normalized = data.map((q: any) => {
            const profileObj = Array.isArray(q.profiles) ? q.profiles[0] ?? null : q.profiles ?? null;
            return {
              id: q.id,
              titre: q.titre,
              texte: q.texte,
              created_at: q.created_at,
              idProfile: q.idProfile,
              profile: profileObj ? { username: profileObj.username } : undefined,
            } as Question;
          });
          setQuestions(normalized);
        } else if (error) {
          console.error("Supabase error:", error);
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  function handleAddedQuestion(q: Question) {
    setQuestions((prev) => [q, ...prev]);
    setShowForm(false);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">Questions: {questions.length}</div>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
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
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="text-gray-500">Aucune question pour le moment.</div>
          ) : (
            questions.map((q) => <QuestionCard key={q.id} question={q} />)
          )}
        </div>
      )}
    </section>
  );
}
