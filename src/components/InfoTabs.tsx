import React, { useState } from "react";

// 🧠 Beispieltext
const sampleAnatomicText = {
  default: {
    anatomy:
      "Das Herz ist ein vierkammeriger Muskel, der Blut durch den Körper pumpt.",
    function: "Pumpt Blut, versorgt Organe mit Sauerstoff.",
    disease: "Krankheiten: KHK, Herzinfarkt, Herzinsuffizienz.",
    quiz: "Welche Kammer ist am stärksten?",
  },
};

// 🧩 Props-Typ definieren
interface SelectedInfo {
  name?: string;
  info?: string;
}

interface InfoTabsProps {
  selected?: SelectedInfo;
}

// 🧩 Komponente
export default function InfoTabs({ selected }: InfoTabsProps) {
  const [tab, setTab] = useState<"Anatomie" | "Funktion" | "Erkrankungen" | "Quizfrage">("Anatomie");

  const name = selected?.name ?? "Herz";
  const info = selected?.info ?? sampleAnatomicText.default.anatomy;

  return (
    <div>
      <div className="tabs">
        {["Anatomie", "Funktion", "Erkrankungen", "Quizfrage"].map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t as typeof tab)}
          >
            {t}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="info-title">{name}</div>
        <div className="info-text" style={{ marginTop: 8 }}>
          {tab === "Anatomie" && (selected ? info : sampleAnatomicText.default.anatomy)}
          {tab === "Funktion" && sampleAnatomicText.default.function}
          {tab === "Erkrankungen" && sampleAnatomicText.default.disease}
          {tab === "Quizfrage" && sampleAnatomicText.default.quiz}
        </div>
      </div>
    </div>
  );
}
