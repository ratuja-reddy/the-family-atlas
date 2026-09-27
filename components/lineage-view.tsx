import { people, relationships } from "@/src/data/family-data";

interface LineageViewProps {
  selectedPersonId: string;
  onSelectPerson: (personId: string) => void;
}

const positions: Record<string, { x: number; y: number }> = {
  evelyn: { x: 120, y: 90 }, arthur: { x: 265, y: 90 }, celine: { x: 650, y: 90 }, robert: { x: 795, y: 90 },
  maeve: { x: 335, y: 275 }, julian: { x: 565, y: 275 },
  anna: { x: 300, y: 460 }, peter: { x: 445, y: 460 }, clara: { x: 700, y: 460 },
  mara: { x: 280, y: 645 }, theo: { x: 480, y: 645 }, ines: { x: 700, y: 645 },
};

const generationLabels = ["Foundations", "Between two shores", "New homes", "Living archive"];

const branchPath = (fromId: string, toId: string) => {
  const from = positions[fromId];
  const to = positions[toId];
  const mid = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y + 42} C ${from.x} ${mid}, ${to.x} ${mid}, ${to.x} ${to.y - 42}`;
};

export function LineageView({ selectedPersonId, onSelectPerson }: LineageViewProps) {
  return (
    <section className="lineage-stage" aria-labelledby="lineage-heading">
      <div className="stage-heading lineage-heading">
        <div><p className="eyebrow">Four generations</p><h1 id="lineage-heading">The family line</h1></div>
        <p>Green branches show parent and child. Copper dashes join partners.</p>
      </div>
      <div className="lineage-scroll" tabIndex={0} aria-label="Scrollable four-generation family tree">
        <div className="lineage-canvas">
          {generationLabels.map((label, index) => <span className="generation-label" key={label} style={{ top: 34 + index * 185 }}>{String(index + 1).padStart(2, "0")} · {label}</span>)}
          <svg className="lineage-lines" viewBox="0 0 920 735" aria-hidden="true">
            {relationships.map((relationship) => {
              if (relationship.type === "partner") {
                const from = positions[relationship.personIds[0]];
                const to = positions[relationship.personIds[1]];
                return <line key={relationship.id} className="partner-line" x1={from.x + 62} y1={from.y} x2={to.x - 62} y2={to.y} />;
              }
              return <path key={relationship.id} className="branch-line" d={branchPath(relationship.parentId, relationship.childId)} />;
            })}
          </svg>
          {people.map((person) => {
            const point = positions[person.id];
            if (!point) return null;
            return (
              <button
                type="button"
                key={person.id}
                className={`lineage-person${selectedPersonId === person.id ? " is-selected" : ""}`}
                style={{ left: point.x, top: point.y, "--person-accent": person.accent } as React.CSSProperties}
                onClick={() => onSelectPerson(person.id)}
                aria-pressed={selectedPersonId === person.id}
              >
                <span>{person.givenName[0]}{person.familyName[0]}</span>
                <strong>{person.givenName}</strong>
                <small>{new Date(`${person.birthDate}T00:00:00`).getFullYear()}</small>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
