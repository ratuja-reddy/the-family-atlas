"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BookOpenText, GitFork, Map, Search, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { people } from "@/src/data/family-data";
import { PersonPanel, PersonPanelContent } from "@/components/person-panel";
import { LineageView } from "@/components/lineage-view";
import { StoriesView } from "@/components/stories-view";

const AtlasMap = dynamic(() => import("@/components/atlas-map").then((module) => module.AtlasMap), { ssr: false });
type FamilyView = "atlas" | "lineage" | "stories";

export function FamilyAtlasApp() {
  const [selectedPersonId, setSelectedPersonId] = useState("evelyn");
  const [view, setView] = useState<FamilyView>("atlas");
  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? people[0];

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const registrations = [
      context.registerTool({
        name: "select_family_person",
        title: "Select family member",
        description: "Select a person in The Family Atlas and update the visible journey and details.",
        inputSchema: { type: "object", properties: { personId: { type: "string", enum: people.map((person) => person.id) } }, required: ["personId"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const personId = typeof input === "object" && input && "personId" in input ? String(input.personId) : "";
          const person = people.find((item) => item.id === personId);
          if (!person) throw new Error("Unknown family member");
          setSelectedPersonId(person.id);
          return { selectedPersonId: person.id, name: `${person.givenName} ${person.familyName}` };
        },
      }, { signal: lifecycle.signal }),
      context.registerTool({
        name: "open_family_view",
        title: "Open family view",
        description: "Open the Atlas, Lineage or Stories view in The Family Atlas.",
        inputSchema: { type: "object", properties: { view: { type: "string", enum: ["atlas", "lineage", "stories"] } }, required: ["view"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const nextView = typeof input === "object" && input && "view" in input ? String(input.view) : "";
          if (!(["atlas", "lineage", "stories"] as string[]).includes(nextView)) throw new Error("Unknown family view");
          setView(nextView as FamilyView);
          return { view: nextView };
        },
      }, { signal: lifecycle.signal }),
    ];
    for (const registration of registrations) void Promise.resolve(registration).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);

  return (
    <main className="app-shell">
      <header className="masthead">
        <a className="brand" href="#main-workspace" aria-label="The Family Atlas home">
          <span className="brand-mark" aria-hidden="true">FA</span>
          <span><strong>The Family Atlas</strong><small>People, places & remembered things</small></span>
        </a>
        <label className="person-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Choose a person</span>
          <select value={selectedPersonId} onChange={(event) => setSelectedPersonId(event.target.value)}>
            {people.map((person) => <option key={person.id} value={person.id}>{person.givenName} {person.familyName}</option>)}
          </select>
        </label>
        <p className="archive-count"><strong>{people.length}</strong> lives · 4 generations</p>
      </header>

      <Tabs value={view} onValueChange={(value) => setView(value as FamilyView)} className="atlas-tabs">
        <nav className="view-nav" aria-label="Family views">
          <TabsList variant="line">
            <TabsTrigger value="atlas"><Map aria-hidden="true" /> Atlas</TabsTrigger>
            <TabsTrigger value="lineage"><GitFork aria-hidden="true" /> Lineage</TabsTrigger>
            <TabsTrigger value="stories"><BookOpenText aria-hidden="true" /> Stories</TabsTrigger>
          </TabsList>
          <div className="map-legend" aria-label="Visual legend">
            <span className="legend-branch">Parent–child</span>
            <span className="legend-partner">Partners</span>
            <span className="legend-route">Selected journey</span>
          </div>
        </nav>

        <TabsContent value="atlas" id="main-workspace" className="workspace-grid">
          <section className="map-stage" aria-labelledby="atlas-heading">
            <div className="stage-heading">
              <div><p className="eyebrow">Geography of a family</p><h1 id="atlas-heading">Lives across the map</h1></div>
              <p>Select a person to trace their life in numbered stops.</p>
            </div>
            <div className="map-frame"><AtlasMap selectedPersonId={selectedPersonId} onSelectPerson={setSelectedPersonId} /></div>
          </section>
          <PersonPanel person={selectedPerson} />
        </TabsContent>
        <TabsContent value="lineage" className="workspace-grid">
          <LineageView selectedPersonId={selectedPersonId} onSelectPerson={setSelectedPersonId} />
          <PersonPanel person={selectedPerson} />
        </TabsContent>
        <TabsContent value="stories" className="workspace-grid">
          <StoriesView onSelectPerson={setSelectedPersonId} />
          <PersonPanel person={selectedPerson} />
        </TabsContent>
      </Tabs>

      <Sheet>
        <SheetTrigger asChild><button type="button" className="mobile-details"><UserRound aria-hidden="true" /> {selectedPerson.givenName}’s details</button></SheetTrigger>
        <SheetContent side="bottom" className="mobile-details-sheet">
          <SheetHeader className="sr-only"><SheetTitle>{selectedPerson.givenName} {selectedPerson.familyName}</SheetTitle><SheetDescription>Dates, relationships, places and stories</SheetDescription></SheetHeader>
          <PersonPanelContent person={selectedPerson} />
        </SheetContent>
      </Sheet>
    </main>
  );
}
