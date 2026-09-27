export type PersonId = string;
export type PlaceId = string;

export interface Person {
  id: PersonId;
  givenName: string;
  familyName: string;
  birthDate: string;
  deathDate?: string;
  generation: number;
  summary: string;
  accent: string;
}

export type Relationship =
  | { id: string; type: "parent-child"; parentId: PersonId; childId: PersonId }
  | { id: string; type: "partner"; personIds: [PersonId, PersonId]; from?: string; to?: string };

export interface Place {
  id: PlaceId;
  name: string;
  country: string;
  coordinates: [number, number];
}

export type LifeEventKind = "born" | "lived" | "married" | "settled" | "died";

export interface LifeEvent {
  id: string;
  personId: PersonId;
  placeId: PlaceId;
  date: string;
  kind: LifeEventKind;
  note: string;
}

export interface Story {
  id: string;
  title: string;
  type: "memory" | "photograph" | "letter" | "recipe";
  date: string;
  excerpt: string;
  personIds: PersonId[];
  placeIds: PlaceId[];
}
