// src/components/InfoTabs.tsx
import React, { useState } from "react";

const sampleAnatomicText = {
  default: {
    anatomy: "Das Herz ist ein vierkammeriger Muskel, der Blut durch den Körper pumpt.",
    function: "Pumpt Blut, versorgt Organe mit Sauerstoff.",
    disease: "Krankheiten: KHK, Herzinfarkt, Herzinsuffizienz.",
  },
};

type TabKey = "Anatomie" | "Funktion" | "Erkrankungen";

interface SelectedInfo {
  name?: string;
  info?: string;
}

interface InfoTabsProps {
  selected?: SelectedInfo;
}

const tabs: TabKey[] = ["Anatomie", "Funktion", "Erkrankungen"];

export default function InfoTabs({ selected }: InfoTabsProps) {
  const [tab, setTab] = useState<TabKey>("Anatomie");
  const name = selected?.name ?? "Herz";
  const info = selected?.info ?? sampleAnatomicText.default.anatomy;

  return (
    <div>
      <div className="tabs">
        {tabs.map((t) => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="info-title">{name}</div>
        <div className="info-text" style={{ marginTop: 8 }}>
          {tab === "Anatomie" && info}
          {tab === "Funktion" && sampleAnatomicText.default.function}
          {tab === "Erkrankungen" && sampleAnatomicText.default.disease}
        </div>
      </div>
    </div>
  );
}