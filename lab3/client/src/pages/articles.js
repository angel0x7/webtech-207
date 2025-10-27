import Layout from "../components/layout.js";


const articles = [
  { id: 1, title: "Découvrir React", content: "React est une bibliothèque JavaScript puissante pour créer des interfaces." },
  { id: 2, title: "Introduction à Next.js", content: "Next.js facilite le rendu côté serveur et la génération statique." },
  { id: 3, title: "Composants réutilisables", content: "Les composants permettent d'écrire un code plus maintenable." },
];

export default function Articles() {
  return (
    <Layout>
    <div style={{ padding: "2rem" }}>
      <h1>Liste des articles</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {articles.map((article) => (
          <li key={article.id} style={{ marginBottom: "1.5rem" }}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
}

