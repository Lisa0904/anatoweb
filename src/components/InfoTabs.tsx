// src/components/InfoTabs.tsx
import React, { useState } from "react";
import anatomyData from "../data/anatomyData.json";

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
  const name = selected?.name ?? "Wähle ein Objekt";

  // 🧠 Normalisiere Name (entfernt z. B. ".001" aus "Haut.001")
  const cleanName = name.replace(/\.\d+$/, "");

  // 🔍 Hole passenden Eintrag aus JSON oder fallback
  const data = anatomyData[cleanName as keyof typeof anatomyData];

  const anatomyText = data?.anatomy ?? "Keine anatomischen Informationen verfügbar.";
  const functionText = data?.function ?? "Keine Funktionsbeschreibung verfügbar.";
  const diseaseText = data?.disease ?? "Keine Erkrankungen zugeordnet.";

  return (
    <div>
      <div className="tabs">
        {tabs.map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="info-title">{cleanName}</div>
        <div className="info-text" style={{ marginTop: 8 }}>
          {tab === "Anatomie" && anatomyText}
          {tab === "Funktion" && functionText}
          {tab === "Erkrankungen" && diseaseText}
        </div>
      </div>
    </div>
  );
}