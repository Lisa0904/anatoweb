import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ModelPage from "./pages/Model";
import Flashcards from "./pages/Flashcards";
import QuizPage from "./pages/QuizPage";
import About from "./pages/About";

export default function App() {
  // 🌗 Global Theme State
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="app">
      {/* Theme Switch */}
      <button
        className="theme-switch"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Theme Switch"
      >
        <div className={`icon ${theme}`}>
          {theme === "light" ? "🌙" : "☀️"}
        </div>
      </button>

      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}