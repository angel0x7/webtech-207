
let comments = [
   {
      id: 'e1a2b3c4-d5e6-47f8-9c1a-1234567890ab',
      timestamp: 1717435049,
      content: 'Super article pour débuter, merci !',
      articleId: 'c1f7e8a2-8d12-4f11-bd72-7e0d6d9c1234',
      author: 'Paul Martin'
    },
    {
      id: 'f2b3c4d5-e6f7-48a9-9b2c-0987654321cd',
      timestamp: 1717535049,
      content: 'Les ransomwares sont vraiment effrayants, j’ai vu une PME en être victime récemment.',
      articleId: 'a9d8b7c3-3c2a-4f41-9f77-8c9f5a8d5678',
      author: 'Clara Dubois'
    },
    {
      id: 'g3c4d5e6-f7g8-49b0-9c3d-2345678901ef',
      timestamp: 1717635049,
      content: 'Très intéressant ! La sécurité du cloud est souvent négligée.',
      articleId: 'b3e4c2f9-5a1b-4e7c-98c1-2f8d7a6e9123',
      author: 'Olivier Bernard'
    },
    {
      id: 'h4d5e6f7-g8h9-40c1-9d4e-3456789012gh',
      timestamp: 1717735049,
      content: 'L’IA est clairement l’avenir de la cybersécurité.',
      articleId: 'd7f5a2c1-6e9d-45b1-9a34-1c9f6e3b4567',
      author: 'Sophie Laurent'
    }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    const { articleId } = req.query;
    if (articleId) {
      return res.status(200).json(comments.filter(c => c.articleId === articleId));
    }
    return res.status(200).json(comments);
  }

  if (req.method === "POST") {    const { articleId, content, author } = req.body;
    if (!articleId || !content || !author) {
      return res.status(400).json({ error: "Champs manquants " });
    }

    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      articleId,
      content,
      author,
      timestamp: Date.now(),
    };

    comments.push(newComment);
    return res.status(201).json(newComment);
  }

  return res.status(405).json({ error: "Méthode non autorisée" });
}
