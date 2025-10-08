import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout.jsx";
import db from "../../db.js";

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;

  const article = db.articles.find((a) => a.id === id);

  const [comments, setComments] = useState<Array<{ id: string; content: string; author: string }>>([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/comments?articleId=${id}`)
        .then((res) => res.json())
        .then((data) => setComments(data));
    }
  }, [id]);

  // Add a comment 
  interface Comment {
    id: string;
    content: string;
    author: string;
  }

  interface NewCommentPayload {
    articleId: string | string[] | undefined;
    content: string;
    author: string;
  }

  const handleAddComment = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim()) return;

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId: id,
        content: newComment,
        author: author,
      } as NewCommentPayload),
    });

    const data: Comment = await res.json();
    setComments((prev) => [...prev, data]);
    setNewComment("");
    setAuthor("");
  };

  if (!article) {
    return (
      <Layout>
        <h1>Article introuvable</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>{article.title}</h1>
      <p><strong>Auteur :</strong> {article.author}</p>
      <p><strong>Date :</strong> {article.date}</p>
      <p>{article.content}</p>

      <h2 style={{ marginTop: "2rem" }}>Commentaires</h2>
      {comments.length === 0 ? (
        <p>Aucun commentaire pour cet article.</p>
      ) : (
        <ul>
          {comments.map((c) => (
            <li key={c.id} style={{ marginBottom: "1rem" }}>
              <p>{c.content}</p>
              <p><em>— {c.author}</em></p>
            </li>
          ))}
        </ul>
      )}

      <h3>Ajouter un commentaire</h3>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Votre nom"
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Votre commentaire..."
          rows={3}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <br />
        <button type="submit">Publier</button>
      </form>
    </Layout>
  );
}
