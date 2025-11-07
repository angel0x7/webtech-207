"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profile?: { username?: string | null };
};

type Answer = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  idQuestion: number;
  profile?: { username?: string | null };
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- external lib not typed
          const normalized = data.map((a: any) => ({
            id: a.id,
            texte: a.texte,
            created_at: a.created_at,
            idProfile: a.idProfile,
            idQuestion: a.idQuestion,
            profile: a.profiles ? { username: a.profiles.username } : undefined,
          }));
          setAnswers(normalized);
        }
      } catch (err) {
        setError(String(err));
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

      const created = JSON.parse(text);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- external lib not typed
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi");
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
