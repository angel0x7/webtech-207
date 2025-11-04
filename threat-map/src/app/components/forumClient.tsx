// components/ForumClient.tsx
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
    idProfile: number | null;
};

export default function ForumClient() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            const { data, error } = await supabase
                .from("questions")
                .select("id,titre,texte,created_at,idProfile")
                .order("created_at", { ascending: false });

            console.log("Supabase  data:", data);
            console.log("Supabase response error:", error);
            console.log("Supabase client type:", typeof supabase);
            if (error) console.error(error);
            if (mounted) setQuestions(data ?? []);
            setLoading(false);
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
                    {showForm ? "Close" : "Add question"}
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
                    {questions.map((q) => (
                        <QuestionCard key={q.id} question={q} />
                    ))}
                </div>
            )}
        </section>
    );
}
