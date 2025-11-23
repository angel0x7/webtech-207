"use client";

import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { Question, Answer } from "../types";

type Profile = { username?: string | null };

export default function QuestionCard({ question }: { question: Question }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  // états pour édition
  const [editing, setEditing] = useState(false);
  const [editTitre, setEditTitre] = useState(question.titre ?? "");
  const [editTexte, setEditTexte] = useState(question.texte ?? "");
  const [savingQuestion, setSavingQuestion] = useState(false);

  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editAnswerText, setEditAnswerText] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    loadUser();
  }, []);

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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        } else {
          setAnswers([]);
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

  async function handleDeleteQuestion() {
    try {
      const res = await fetch(`/api/questions/${question.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression question");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  async function handleDeleteAnswer(id: number) {
    try {
      const res = await fetch(`/api/commentaires/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression commentaire");
      setAnswers((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  async function handleUpdateQuestion() {
    try {
      setSavingQuestion(true);
      const res = await fetch(`/api/questions/${question.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre: editTitre, texte: editTexte }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.message || "Erreur mise à jour question");
      // mettre à jour l’affichage
      setEditing(false);
      // synchroniser la source question 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function handleUpdateAnswer(id: number) {
    try {
      setSavingAnswer(true);
      const res = await fetch(`/api/commentaires/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texte: editAnswerText }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.message || "Erreur mise à jour commentaire");
      setAnswers((prev) =>
        prev.map((a) => (a.id === id ? { ...a, texte: updated.texte } : a))
      );
      setEditingAnswerId(null);
      setEditAnswerText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSavingAnswer(false);
    }
  }

  return (
    <article className="p-6 bg-gray-900/70 border border-gray-700 rounded-2xl shadow-lg text-gray-100">
      {/* Question */}
      {editing ? (
        <div className="space-y-2">
          <input
            value={editTitre}
            onChange={(e) => setEditTitre(e.target.value)}
            placeholder="Titre"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <textarea
            value={editTexte}
            onChange={(e) => setEditTexte(e.target.value)}
            placeholder="Contenu"
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
            rows={4}
          />
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded"
              onClick={handleUpdateQuestion}
              disabled={savingQuestion}
            >
              {savingQuestion ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded"
              onClick={() => {
                setEditing(false);
                setEditTitre(question.titre ?? "");
                setEditTexte(question.texte ?? "");
              }}
              disabled={savingQuestion}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-blue-400">{editTitre}</h3>
          <p className="text-sm text-gray-300 mt-2">{editTexte}</p>

          <div className="mt-3 text-xs text-gray-500">
            Posté par <span className="text-blue-400">{question.profile?.username ?? "Anonyme"}</span> —{" "}
            {new Date(question.created_at).toLocaleString()}
          </div>

          {user?.id === question.idProfile && (
            <div className="mt-2 flex gap-2">
              <button
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                onClick={() => setEditing(true)}
              >
                Modifier
              </button>
              <button
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                onClick={handleDeleteQuestion}
              >
                Supprimer
              </button>
            </div>
          )}
        </>
      )}

      {/* Formulaire de réponse */}
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

      {/* Liste des réponses */}
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
              {editingAnswerId === a.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs"
                      onClick={() => handleUpdateAnswer(a.id)}
                      disabled={savingAnswer}
                    >
                      {savingAnswer ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs"
                      onClick={() => {
                        setEditingAnswerId(null);
                        setEditAnswerText("");
                      }}
                      disabled={savingAnswer}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-200">{a.texte}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Par <span className="text-blue-400">{a.profile?.username ?? "Anonyme"}</span> —{" "}
                    {new Date(a.created_at).toLocaleString()}
                  </p>

                  {user?.id === a.idProfile && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs"
                        onClick={() => {
                          setEditingAnswerId(a.id);
                          setEditAnswerText(a.texte);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
                        onClick={() => handleDeleteAnswer(a.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Erreur globale */}
      {error && !showForm && (
        <p className="mt-4 text-sm text-red-500">{error}</p>
      )}
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
