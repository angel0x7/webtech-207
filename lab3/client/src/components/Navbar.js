import Link from "next/link";

export default function Navbar() {
  return (
    <header style={{ backgroundColor: "#000000ff", color: "white", padding: "1rem" }}>
      <h1 style={{ textAlign: "center", margin: 0 }}>News</h1>

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          backgroundColor: "#222",
          padding: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        <Link href="/" style={{ color: "#ec604eff", textDecoration: "none" }}>
          Home
        </Link>
        <Link href="/articles" style={{ color: "#ec604eff", textDecoration: "none" }}>
          Articles
        </Link>
        <Link href="/about" style={{ color: "#ec604eff", textDecoration: "none" }}>
          About
        </Link>
        <Link href="/contacts" style={{ color: "#ec604eff", textDecoration: "none" }}>
          Contacts
        </Link>
      </nav>
    </header>
  );
}
