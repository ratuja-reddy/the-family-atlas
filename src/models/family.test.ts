import { describe, expect, it } from "vitest";
import { lifeEvents, people, places, relationships } from "@/src/data/family-data";
import { getJourney, getRelationships } from "@/src/models/selectors";

describe("family data model", () => {
  it("covers four generations with valid relationship references", () => {
    expect([...new Set(people.map((person) => person.generation))]).toEqual([1, 2, 3, 4]);
    const personIds = new Set(people.map((person) => person.id));
    for (const relationship of relationships) {
      const ids = relationship.type === "partner" ? relationship.personIds : [relationship.parentId, relationship.childId];
      expect(ids.every((id) => personIds.has(id))).toBe(true);
    }
  });

  it("keeps every life event attached to an existing person and place", () => {
    const personIds = new Set(people.map((person) => person.id));
    const placeIds = new Set(places.map((place) => place.id));
    expect(lifeEvents.every((event) => personIds.has(event.personId) && placeIds.has(event.placeId))).toBe(true);
    expect(people.every((person) => lifeEvents.some((event) => event.personId === person.id))).toBe(true);
  });

  it("returns Evelyn's numbered journey in chronological order", () => {
    const journey = getJourney("evelyn");
    expect(journey).toHaveLength(5);
    expect(journey.map((event) => event.kind)).toEqual(["born", "lived", "settled", "lived", "died"]);
    expect(journey.map((event) => event.date)).toEqual([...journey.map((event) => event.date)].sort());
  });

  it("derives a person's parents, partner and children", () => {
    const roles = getRelationships("anna").map(({ role }) => role).sort();
    expect(roles).toEqual(["Child", "Child", "Parent", "Parent", "Partner"]);
  });
});
