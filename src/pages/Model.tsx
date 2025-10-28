import React, { useState, type JSX } from "react";
import AnatomyViewer from "../components/AnatomyViewer";
import InfoTabs from "../components/InfoTabs";

interface SelectedInfo {
  name: string;
  info?: string;
}

export default function ModelPage(): JSX.Element {
  // Use undefined instead of null to match InfoTabs optional prop
  const [selected, setSelected] = useState<SelectedInfo | undefined>(undefined);

  return (
    <div className="page-grid">
      <div className="viewer">
        <AnatomyViewer
          onSelect={(objName: string, info?: string) =>
            setSelected({ name: objName, info })
          }
        />
      </div>

      <div className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 18, color: "var(--muted)" }}>
              Anatomie-Explorer
            </div>
            <h2 style={{ marginTop: 8 }}>{selected?.name ?? "Herz"}</h2>
          </div>
        </div>

        <InfoTabs selected={selected} />
      </div>
    </div>
  );
}
