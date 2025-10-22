export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Première connexion
        </h1>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-all"
          >
            Créer un compte
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-400">
          Déjà un compte ?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
