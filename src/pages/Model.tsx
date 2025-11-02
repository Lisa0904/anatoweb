import React, { useState, useMemo } from "react";
import AnatomyViewer from "../components/AnatomyViewer";
import InfoTabs from "../components/InfoTabs";

type Topic = "Ganzer Mensch" | "Muskeln" | "Skelett" | "Kreislaufsystem" | "Organe";

export default function ModelPage() {
  const [topic, setTopic] = useState<Topic>("Ganzer Mensch");
  const [selected, setSelected] = useState<{ name: string; info?: string }>();

  const modelPaths: Record<Topic, string> = useMemo(
    () => ({
      "Ganzer Mensch": "/models/anatoweb_full.glb",
      Muskeln: "/models/anatoweb_muscles.glb",
      Skelett: "/models/anatoweb_skeleton.glb",
      Kreislaufsystem: "/models/anatoweb_circulatory.glb",
      Organe: "/models/anatoweb_organs.glb",
    }),
    []
  );

  const currentModelUrl = modelPaths[topic];

  return (
    <div style={{ maxWidth: 1370, margin: "0 auto" }}>
      <h1 className="title">3D-Modell</h1>

      <p className="lead">
        Klicke auf verschiedene Teile des Modells, um mehr Informationen zu erhalten.
      </p>
    <div className="page-grid">
      <div className="viewer">
        {/* Themenauswahl */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {Object.keys(modelPaths).map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t as Topic)}
              className={`ctrl-btn ${topic === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ✅ Hier wird die aktuelle modelUrl übergeben */}
        <AnatomyViewer
          key={currentModelUrl}
          modelUrl={currentModelUrl}
          onSelect={(objName, info) => setSelected({ name: objName, info })}
        />
      </div>

      <div className="panel">
        <InfoTabs selected={selected} />
      </div>
    </div>
    </div>
  );
}