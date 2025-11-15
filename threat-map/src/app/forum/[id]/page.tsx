"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../config/supabaseClient";
import QuestionCard from "../../components/questionCard";
import { Question } from "../../types";

type SupabaseQuestionRow = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  idProfile: string | null;
  profiles: { username: string | null } | null | { username: string | null }[]; // 👈 accepte tableau ou objet
};

export default function QuestionPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestion() {
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
        .eq("id", id)
        .single();

      if (!error && data) {
        const row = data as SupabaseQuestionRow;
        let username: string | null = null;

        if (Array.isArray(row.profiles)) {
          username = row.profiles[0]?.username ?? null;
        } else {
          username = row.profiles?.username ?? null;
        }
        setQuestion({
          id: row.id,
          titre: row.titre,
          texte: row.texte,
          created_at: row.created_at,
          idProfile: row.idProfile,
          profile: { username },
        });
      }

      setLoading(false);
    }

    loadQuestion();
  }, [id]);

  return (
    <main className="p-6 min-h-screen bg-[#0b0d2b] text-gray-100">
      {loading ? (
        <p className="text-gray-400 animate-pulse">Chargement de la question…</p>
      ) : question ? (
        <QuestionCard question={question} />
      ) : (
        <p className="text-red-500">Question introuvable.</p>
      )}
    </main>
  );
}
