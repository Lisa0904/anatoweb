import { Link } from "react-router-dom";

export default function Footer() {

const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p>
        <Link to="/impressum">Impressum</Link> | &copy; {currentYear} AnatoWeb{" "}
        {/* <Link to="/kontakt">Kontakt</Link> |{" "} */}
         
      </p>
    </footer>
  );
} 