"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "../../config/supabaseClient";

type Profile = {
  username: string | null;
};

type Comment = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  profile?: Profile;
};

type Question = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  profile?: Profile;
};

type SupabaseProfileField =
  | { username: string | null }
  | { username: string | null }[]
  | null;

type SupabaseQuestionRow = {
  id: number;
  titre: string | null;
  texte: string | null;
  created_at: string;
  profiles: SupabaseProfileField;
};

type SupabaseCommentRow = {
  id: number;
  texte: string;
  created_at: string;
  idProfile: string | null;
  profiles: SupabaseProfileField;
};

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Charger la question
      const { data: qData, error: qError } = await supabase
        .from("question")
        .select(`
          id,
          titre,
          texte,
          created_at,
          profiles: idProfile ( username )
        `)
        .eq("id", id)
        .single<SupabaseQuestionRow>();

      if (qError || !qData) {
        console.error(qError);
        setLoading(false);
        return;
      }

      setQuestion({
        id: qData.id,
        titre: qData.titre,
        texte: qData.texte,
        created_at: qData.created_at,
        profile: {
          username: Array.isArray(qData.profiles)
            ? qData.profiles[0]?.username ?? null
            : qData.profiles?.username ?? null,
        },
      });

      // Charger les commentaires
      const { data: cData, error: cError } = await supabase
        .from("commentaire")
        .select(`
          id,
          texte,
          created_at,
          idProfile,
          profiles: idProfile ( username )
        `)
        .eq("idQuestion", id)
        .order("created_at", { ascending: true })
        .returns<SupabaseCommentRow[]>();

      if (cError) console.error(cError);

      const normalized: Comment[] = (cData ?? []).map((c) => ({
        id: c.id,
        texte: c.texte,
        created_at: c.created_at,
        idProfile: c.idProfile,
        profile: {
          username: Array.isArray(c.profiles)
            ? c.profiles[0]?.username ?? null
            : c.profiles?.username ?? null,
        },
      }));

      setComments(normalized);
      setLoading(false);
    }

    loadData();

    // Récupérer l’utilisateur connecté
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, [id]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      alert("Vous devez être connecté pour commenter.");
      return;
    }

    setPosting(true);
    const { data, error } = await supabase
      .from("commentaire")
      .insert({
        texte: commentText,
        idQuestion: id,
        idProfile: user.id,
      })
      .select(`
        id,
        texte,
        created_at,
        idProfile,
        profiles: idProfile ( username )
      `)
      .single<SupabaseCommentRow>();

    if (error || !data) {
      console.error(error);
      setPosting(false);
      return;
    }

    const newComment: Comment = {
      id: data.id,
      texte: data.texte,
      created_at: data.created_at,
      idProfile: data.idProfile,
      profile: {
        username: Array.isArray(data.profiles)
          ? data.profiles[0]?.username ?? null
          : data.profiles?.username ?? null,
      },
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");
    setPosting(false);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-300">
        Chargement...
      </div>
    );

  if (!question)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        Question introuvable.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0d2b] text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-900/60 rounded-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-semibold text-blue-400 mb-2">{question.titre}</h1>
        <p className="text-gray-300 mb-4">{question.texte}</p>
        <p className="text-sm text-gray-500 mb-6">
          Posté par {question.profile?.username ?? "Anonyme"} le{" "}
          {new Date(question.created_at).toLocaleString("fr-FR")}
        </p>

        <h2 className="text-lg font-semibold text-cyan-400 mb-3">
          Commentaires ({comments.length})
        </h2>

        <div className="space-y-3 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-500">Aucun commentaire pour le moment.</p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="bg-gray-800/60 border border-gray-700 p-3 rounded-lg"
              >
                <p className="text-gray-200">{c.texte}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {c.profile?.username ?? "Anonyme"} —{" "}
                  {new Date(c.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="flex flex-col gap-3">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Écrire un commentaire..."
            className="w-full rounded-md p-3 bg-gray-800 text-gray-100 border border-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
            rows={3}
          />

          <button
            type="submit"
            disabled={posting}
            className="self-end px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition"
          >
            {posting ? "Envoi..." : "Publier le commentaire"}
          </button>
        </form>
      </div>
    </div>
  );
}
