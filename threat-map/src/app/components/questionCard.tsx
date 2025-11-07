"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

type Profile = { username?: string | null };
type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profile?: Profile;
};
type Answer = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  idQuestion: number;
  profile?: Profile;
};

export default function QuestionCard({ question }: { question: Question }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnswers() {
      setLoadingAnswers(true);
      try {
        const { data, error } = await supabase
          .from("commentaire")
          .select(`
            id,
            texte,
            created_at,
            idProfile,
            idQuestion,
            profiles: idProfile ( username )
          `)
          .eq("idQuestion", question.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data) {
          const normalized: Answer[] = data.map((a: any) => ({
            id: a.id,
            texte: a.texte,
            created_at: a.created_at,
            idProfile: a.idProfile,
            idQuestion: a.idQuestion,
            profile: Array.isArray(a.profiles)
              ? { username: a.profiles[0]?.username ?? null }
              : a.profiles ?? undefined,
          }));
          setAnswers(normalized);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingAnswers(false);
      }
    }

    loadAnswers();
  }, [question.id]);

  async function handleAddAnswer(texte: string) {
    setPosting(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const res = await fetch("/api/commentaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texte,
          idQuestion: question.id,
          idProfile: user?.id || null,
        }),
      });

      const created = await res.json();
      if (!res.ok) throw new Error(created.message || "Erreur serveur");

      const normalized: Answer = {
        id: created.id,
        texte: created.texte,
        created_at: created.created_at,
        idProfile: created.idProfile,
        idQuestion: created.idQuestion,
        profile: created.profiles
          ? { username: created.profiles.username }
          : undefined,
      };

      setAnswers((prev) => [...prev, normalized]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setPosting(false);
    }
  }

  return (
    <article className="p-6 bg-gray-900/70 border border-gray-700 rounded-2xl shadow-lg text-gray-100">
      <h3 className="text-lg font-semibold text-blue-400">{question.titre}</h3>
      <p className="text-sm text-gray-300 mt-2">{question.texte}</p>

      <div className="mt-3 text-xs text-gray-500">
        Posté par <span className="text-blue-400">{question.profile?.username ?? "Anonyme"}</span> —{" "}
        {new Date(question.created_at).toLocaleString()}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Annuler" : "Répondre"}
        </button>
        <div className="text-sm text-gray-400">{answers.length} réponse(s)</div>
      </div>

      {showForm && (
        <div className="mt-4">
          <AnswerForm onAdd={handleAddAnswer} disabled={posting} />
          {posting && <p className="text-sm text-gray-400 mt-2">Envoi...</p>}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {loadingAnswers ? (
          <p className="text-sm text-gray-400">Chargement des réponses...</p>
        ) : answers.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune réponse pour le moment.</p>
        ) : (
          answers.map((a) => (
            <div
              key={a.id}
              className="p-3 bg-gray-800/60 border border-gray-700 rounded-lg"
            >
              <p className="text-sm text-gray-200">{a.texte}</p>
              <p className="mt-1 text-xs text-gray-500">
                Par <span className="text-blue-400">{a.profile?.username ?? "Anonyme"}</span> —{" "}
                {new Date(a.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </article>
  );
}

function AnswerForm({
  onAdd,
  disabled = false,
}: {
  onAdd: (texte: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim());
        setText("");
      }}
      className="flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrire une réponse..."
        className="flex-1 border border-gray-700 bg-gray-800/70 text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        disabled={disabled}
      />
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg font-medium transition ${
          disabled ? "bg-green-800" : "bg-green-600 hover:bg-green-500"
        } text-white`}
        disabled={disabled}
      >
        Répondre
      </button>
    </form>
  );
}
