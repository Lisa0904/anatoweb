import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        <Link to="/impressum">Impressum</Link> | 2025 AnatoWeb{" "}
        {/* <Link to="/kontakt">Kontakt</Link> |{" "} */}
         
      </p>
    </footer>
  );
}