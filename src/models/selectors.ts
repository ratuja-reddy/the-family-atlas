import { lifeEvents, people, places, relationships, stories } from "@/src/data/family-data";
import type { Person, PersonId, Relationship } from "@/src/models/family";

export interface PersonRelationship {
  relationship: Relationship;
  relative: Person | undefined;
  role: "Partner" | "Child" | "Parent";
}

export const getPerson = (id: PersonId) => people.find((person) => person.id === id);
export const getPlace = (id: string) => places.find((place) => place.id === id);

export function getJourney(personId: PersonId) {
  return lifeEvents.filter((event) => event.personId === personId).sort((a, b) => a.date.localeCompare(b.date));
}

export function getRelationships(personId: PersonId) {
  return relationships.reduce<PersonRelationship[]>((matches, relationship) => {
    if (relationship.type === "partner" && relationship.personIds.includes(personId)) {
      const relativeId = relationship.personIds.find((id) => id !== personId)!;
      matches.push({ relationship, relative: getPerson(relativeId), role: "Partner" });
    }
    if (relationship.type === "parent-child" && relationship.parentId === personId) {
      matches.push({ relationship, relative: getPerson(relationship.childId), role: "Child" });
    }
    if (relationship.type === "parent-child" && relationship.childId === personId) {
      matches.push({ relationship, relative: getPerson(relationship.parentId), role: "Parent" });
    }
    return matches;
  }, []);
}

export const getStoriesForPerson = (personId: PersonId) => stories.filter((story) => story.personIds.includes(personId));

export const getPrimaryPlaceForPerson = (personId: PersonId) => {
  const journey = getJourney(personId);
  return journey.length ? getPlace(journey[journey.length - 1].placeId) : undefined;
};
