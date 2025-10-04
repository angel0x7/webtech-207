import Layout from "../components/layout.js";
export default function Contacts() {
  return (
    <Layout>
    <div style={{ padding: "2rem" }}>
      <h1>Contact</h1>
      <p>
        Vous pouvez nous écrire à : <a href="mailto:contact@example.com">contact@example.com</a>
      </p>
      <p>Téléphone : +33 6 12 34 56 78</p>
    </div>
    </Layout>
  );
}
