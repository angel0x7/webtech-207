"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import QuestionCard from "./questionCard";
import NewQuestion from "./newQuestion";

type Profile = { username?: string | null };

type SupabaseQuestionRow = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profiles?: { username: string | null } | { username: string | null }[] | null;
};

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profile?: Profile;
};

export default function ForumClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadQuestions() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("question")
          .select(`
            id,
            titre,
            texte,
            created_at,
            idProfile,
            profiles: idProfile ( username )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted && data) {
          const normalized: Question[] = (data as SupabaseQuestionRow[]).map((q) => {
            let username: string | null = null;

            if (Array.isArray(q.profiles)) {
              username = q.profiles[0]?.username ?? null;
            } else if (q.profiles && "username" in q.profiles) {
              username = q.profiles.username ?? null;
            }

            return {
              id: q.id,
              titre: q.titre,
              texte: q.texte,
              created_at: q.created_at,
              idProfile: q.idProfile,
              profile: username ? { username } : undefined,
            };
          });

          setQuestions(normalized);
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuestions();
    return () => {
      mounted = false;
    };
  }, []);

  function handleAddedQuestion(q: Question) {
    setQuestions((prev) => [q, ...prev]);
    setShowForm(false);
  }

  return (
    <section className="p-6 min-h-screen bg-[#0b0d2b] text-gray-100">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
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
      ) : questions.length === 0 ? (
        <p className="text-gray-500">Aucune question pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </section>
  );
}
