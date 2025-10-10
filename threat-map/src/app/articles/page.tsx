import Layout from "../components/layout";
import db from "../db";
import Link from "next/link";

export default function Articles() {
  return (
    <Layout>
      <h1>Articles sur la cybersécurité</h1>
      <ul>
        {db.articles.map(article => (
          <li key={article.id} style={{ marginBottom: "1rem" }}>
            <h2>
              <Link href={`/articles/${article.id}`}>
                {article.title}
              </Link>
            </h2>
            <p><strong>Auteur :</strong> {article.author}</p>
            <p><strong>Date :</strong> {article.date}</p>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
