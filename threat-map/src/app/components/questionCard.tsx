// components/QuestionCard.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: number | null;
};

type Answer = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: number | null;
  idQuestion: number;
};

export default function QuestionCard({ question }: { question: Question }) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    supabase
      .from("commentaire")
      .select("*")
      .eq("idQuestion", question.id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        setLoading(false);
        if (error) return console.error(error);
        setAnswers(data as Answer[]);
      });
  }, [open, question.id]);

  async function handleAddAnswer(texte: string) {
    if (!texte.trim()) return;
    const payload = { texte, idQuestion: question.id, idProfile: null };
    const { data, error } = await supabase.from("answers").insert(payload).select().single();
    if (error) return alert("Error: " + error.message);
    setAnswers((s) => [...s, data as Answer]);
  }

  return (
    <article className="border rounded p-4 bg-white shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{question.titre ?? "Untitled question"}</h2>
          <p className="text-sm text-gray-600">{question.texte}</p>
          <p className="text-xs text-gray-400 mt-2">Asked: {new Date(question.created_at).toLocaleString()}</p>
        </div>

        <div className="ml-4">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Answers"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Answers</h3>

          {loading ? (
            <p>Loading answers…</p>
          ) : answers.length === 0 ? (
            <p className="text-sm text-gray-500">No answers yet. Be the first to reply.</p>
          ) : (
            <ul className="space-y-2">
              {answers.map((a) => (
                <li key={a.id} className="p-2 border rounded bg-gray-50">
                  <div className="text-sm">{a.texte}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            <AnswerForm onAdd={handleAddAnswer} />
          </div>
        </div>
      )}
    </article>
  );
}

function AnswerForm({ onAdd }: { onAdd: (texte: string) => void }) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(text);
        setText("");
      }}
      className="flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border rounded px-3 py-2"
        placeholder="Write an answer..."
      />
      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Reply
      </button>
    </form>
  );
}
