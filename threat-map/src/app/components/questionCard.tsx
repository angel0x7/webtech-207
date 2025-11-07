"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

type Profile = {
  username?: string | null;
};

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

type SupabaseAnswerRow = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  idQuestion: number;
  profiles?: { username: string | null } | { username: string | null }[] | null;
};

export default function QuestionCard({ question }: { question: Question }) {
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

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

        if (error) {
          setError(error.message ?? "Erreur en récupérant les réponses");
        } else if (mounted && data) {
          const normalized: Answer[] = (data as SupabaseAnswerRow[]).map((a) => {
            let username: string | null = null;

            if (Array.isArray(a.profiles)) {
              // Si Supabase renvoie un tableau
              username = a.profiles[0]?.username ?? null;
            } else if (a.profiles && "username" in a.profiles) {
              // Si Supabase renvoie un objet
              username = a.profiles.username ?? null;
            }

            return {
              id: a.id,
              texte: a.texte,
              created_at: a.created_at,
              idProfile: a.idProfile,
              idQuestion: a.idQuestion,
              profile: username ? { username } : undefined,
            };
          });

          setAnswers(normalized);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setLoadingAnswers(false);
      }
    }

    loadAnswers();
    return () => {
      mounted = false;
    };
  }, [question.id]);

  async function handleAddAnswer(texte: string) {
    setPosting(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const res = await fetch("/api/commentaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texte,
          idQuestion: question.id,
          idProfile: user?.id || null,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to post answer");

      const created: SupabaseAnswerRow = JSON.parse(text);

      let username: string | null = null;
      if (Array.isArray(created.profiles)) {
        username = created.profiles[0]?.username ?? null;
      } else if (created.profiles && "username" in created.profiles) {
        username = created.profiles.username ?? null;
      }

      const normalized: Answer = {
        id: created.id,
        texte: created.texte,
        created_at: created.created_at,
        idProfile: created.idProfile,
        idQuestion: created.idQuestion,
        profile: username ? { username } : undefined,
      };

      setAnswers((prev) => [...prev, normalized]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setPosting(false);
    }
  }

  return (
    <article className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold text-lg">{question.titre}</h3>
      <p className="text-sm text-gray-700 mt-1">{question.texte}</p>
      <div className="mt-2 text-xs text-gray-500">
        Posté par : {question.profile?.username ?? "Anonyme"} —{" "}
        {new Date(question.created_at).toLocaleString()}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Annuler" : "Répondre"}
        </button>
        <div className="text-sm text-gray-500">{answers.length} réponse(s)</div>
      </div>

      {showForm && (
        <div className="mt-3">
          <AnswerForm onAdd={handleAddAnswer} disabled={posting} />
          {posting && (
            <div className="text-sm text-gray-500 mt-2">Envoi…</div>
          )}
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </div>
      )}

      <div className="mt-4 space-y-3">
        {loadingAnswers ? (
          <div className="text-sm text-gray-500">Chargement des réponses…</div>
        ) : answers.length === 0 ? (
          <div className="text-sm text-gray-500">Pas encore de réponses</div>
        ) : (
          answers.map((a) => (
            <div key={a.id} className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-800">{a.texte}</div>
              <div className="mt-1 text-xs text-gray-500">
                Par {a.profile?.username ?? "Anonyme"} —{" "}
                {new Date(a.created_at).toLocaleString()}
              </div>
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
        className="flex-1 border rounded px-3 py-2"
        placeholder="Écrire une réponse..."
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={disabled}
      >
        Répondre
      </button>
    </form>
  );
}
