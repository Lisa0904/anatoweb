import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <Link to="/impressum">Impressum</Link> |{" "}
        <Link to="/kontakt">Kontakt</Link> |{" "}
        <Link to="/about">Über Uns</Link> | 2025 AnatoWeb
      </p>
    </footer>
  );
}