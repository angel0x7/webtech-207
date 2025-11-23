"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import NewQuestion from "../components/newQuestion";
import QuestionCard from "../components/questionCard";
import { Question, Answer } from "../types";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// Types
type Profile = { username: string | null };
type SupabaseQuestionRow = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profiles: Profile | Profile[] | null;
};



export default function ForumClient() {
  const router=useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [myQuestions, setMyQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null); // Etat de sélection
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

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

      if (!error && data) {
        const normalized: Question[] = (data as SupabaseQuestionRow[]).map((q) => {
          const username = Array.isArray(q.profiles)
            ? q.profiles[0]?.username
            : q.profiles?.username;

          return {
            id: q.id,
            titre: q.titre,
            texte: q.texte,
            created_at: q.created_at,
            idProfile: q.idProfile,
            profile: { username: username ?? null },
          };
        });

        setQuestions(normalized);
        if (user) setMyQuestions(normalized.filter((q) => q.idProfile === user.id));
        // Optionnel: sélectionner automatiquement la première
        setSelected((prev) => prev ?? normalized[0] ?? null);
      }

      setLoading(false);
    }

    load();
  }, []);

  function handleAddedQuestion(q: Question) {
    setQuestions((prev) => [q, ...prev]);
    if (user && q.idProfile === user.id) setMyQuestions((prev) => [q, ...prev]);
    setShowForm(false);
    setSelected(q); // sélectionner la nouvelle question
  }

  async function handleDeleteQuestion(id: number) {
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setMyQuestions((prev) => prev.filter((q) => q.id !== id));
      setSelected((prev) => (prev?.id === id ? null : prev));
    }
  }

  return (
    <section className="p-6 min-h-screen bg-[#0b0d2b] text-gray-100 flex gap-6">
      {/* colonne principale: liste */}
      <div className="flex-1">
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
                className={`bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:bg-gray-800 transition-all cursor-pointer ${selected?.id === q.id ? "ring-2 ring-blue-500" : ""
                  }`}
                
                onClick={() => router.push(`/forum/${q.id}`)}
              >
                <h2 className="text-lg font-semibold text-blue-400">{q.titre}</h2>
                <p className="text-gray-300 mt-1 line-clamp-2">{q.texte}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Posté par {q.profile?.username ?? "Anonyme"} le{" "}
                  {new Date(q.created_at).toLocaleString("fr-FR")}
                </p>

                {/* Boutons visibles seulement pour l’auteur */}
                {user?.id === q.idProfile && (
                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuestion(q.id);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    

      {/* sidebar avec mes questions */}
      <aside className="w-64 bg-gray-900/40 border border-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-400 mb-3">Mes questions</h4>
        {myQuestions.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune question</p>
        ) : (
          <ul className="space-y-2">
            {myQuestions.map((q) => (
              <li
                key={q.id}
                onClick={() => setSelected(q)} // sélection via la sidebar
                className={`cursor-pointer text-sm hover:text-blue-400 truncate ${selected?.id === q.id ? "text-blue-400" : "text-gray-300"
                  }`}
              >
                {q.titre}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </section>
  );
}
