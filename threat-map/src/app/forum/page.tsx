// app/forum/page.tsx
import { supabase } from "../config/supabaseClient";
import QuestionCard from "../components/questionCard";

export default async function ForumPage() {
  const { data: questions, error } = await supabase
    .from("question")
    .select("id,titre,texte,created_at,idProfile")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Forum</h1>
      <section className="space-y-4">
        {questions?.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </section>
    </main>
  );
}
