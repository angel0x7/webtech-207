import Header from "./header.js";
import Footer from "./footer.js";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      <Footer />
    </div>
  );
}
