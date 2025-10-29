// src/pages/Model.tsx
import React, { useState } from "react";
import AnatomyViewer from "../components/AnatomyViewer";
import InfoTabs from "../components/InfoTabs";
import type { JSX } from "react/jsx-runtime";

interface SelectedInfo {
  name: string;
  info?: string;
}

export default function ModelPage(): JSX.Element {
  const [selected, setSelected] = useState<SelectedInfo | undefined>(undefined);

  return (
    <div className="page-grid">
      <div className="viewer">
        <AnatomyViewer
          onSelect={(objName: string, info?: string) => setSelected({ name: objName, info })}
        />
      </div>

      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, color: "var(--muted)" }}>Anatomie-Explorer</div>
            <h2 style={{ marginTop: 8 }}>{selected?.name ?? "Herz"}</h2>
          </div>
        </div>

        <InfoTabs selected={selected} />
      </div>
    </div>
  );
}