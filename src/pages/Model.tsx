// src/pages/Model.tsx
import React, { useState, useMemo } from "react";
import AnatomyViewer from "../components/AnatomyViewer";
import InfoTabs from "../components/InfoTabs";
import type { JSX } from "react/jsx-runtime";

interface SelectedInfo {
  name: string;
  info?: string;
}

type Topic = "Ganzer Mensch" | "Muskeln" | "Skelett" | "Arterien" | "Organe";

export default function ModelPage(): JSX.Element {
  const [selected, setSelected] = useState<SelectedInfo | undefined>(undefined);
  const [topic, setTopic] = useState<Topic>("Ganzer Mensch");

  // 🧩 Mapping der GLB-Dateien je Themengebiet
  const modelPaths: Record<Topic, string> = useMemo(
    () => ({
      "Ganzer Mensch": "/models/anatoweb_full.glb",
      Muskeln: "/models/anatoweb_muscles.glb",
      Skelett: "/models/anatoweb_skeleton.glb",
      Arterien: "/models/anatoweb_arteries.glb",
      Organe: "/models/anatoweb_organs.glb",
    }),
    []
  );

  const currentModelUrl = modelPaths[topic];

  return (
    <div className="page-grid">
      {/* 👇 Linke Seite: 3D Viewer */}
      <div className="viewer">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 18, color: "var(--muted)" }}>3D-Modell</div>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            Themengebiet: <strong>{topic}</strong>
          </div>
        </div>

        {/* Themenauswahl */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {["Ganzer Mensch", "Muskeln", "Skelett", "Arterien", "Organe"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTopic(t as Topic);
                setSelected(undefined);
              }}
              className={`ctrl-btn ${topic === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnatomyViewer
          key={currentModelUrl} // ⚡ wichtig: reload bei Themenwechsel
          onSelect={(objName: string, info?: string) => setSelected({ name: objName, info })}
          modelUrl={currentModelUrl}
        />
      </div>

      {/* 👇 Rechte Seite: Info Panel */}
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, color: "var(--muted)", marginBottom: 18 }}>
              Anatomie-Explorer
            </div>
            {/*<h2 style={{ marginTop: 8 }}>{selected?.name ?? "Wähle ein Objekt"}</h2>*/}
          </div>
        </div>

        <InfoTabs selected={selected} />
      </div>
    </div>
  );
}