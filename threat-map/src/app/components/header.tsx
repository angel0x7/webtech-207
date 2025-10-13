import Link from "next/link";

export default function Header() {
  return (
    <header style={{ background: "#000000ff", color: "#fff", padding: "1rem" }}>
      <h1 style={{ margin: 0, textAlign: "center", fontSize: "2rem" }}>
        Threat Map
      </h1>
      <nav style={{ display: "flex", gap: "1rem", background:"#2e2d2dff", padding:"10px" }}>
        <Link href="/"><span style={{ color: "#93d2f0ff" }}>Home</span></Link>
        <Link href="/articles"><span style={{ color: "#93d2f0ff" }}>Articles</span></Link>
        <Link href="/about"><span style={{ color: "#93d2f0ff" }}>About</span></Link>
        <Link href="/contacts"><span style={{ color: "#93d2f0ff" }}>Contacts</span></Link>
      </nav>
    </header>
  );
}