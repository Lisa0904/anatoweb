import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ModelPage from "./pages/Model";
import QuizPage from "./pages/QuizPage";
import About from "./pages/About";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}