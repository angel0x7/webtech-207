export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "1rem", marginTop: "2rem", background: "#f2f2f2" }}>
      <p>© {new Date().getFullYear()} My Blog. All rights reserved.</p>
    </footer>
  );
}
