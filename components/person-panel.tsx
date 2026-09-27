import { BookOpen, CalendarDays, MapPin, UsersRound } from "lucide-react";
import { getJourney, getPlace, getRelationships, getStoriesForPerson } from "@/src/models/selectors";
import type { Person } from "@/src/models/family";

const year = (date: string) => new Date(`${date}T00:00:00`).getFullYear();

export function PersonPanelContent({ person }: { person: Person }) {
  const journey = getJourney(person.id);
  const relatives = getRelationships(person.id);
  const personStories = getStoriesForPerson(person.id);
  return (
    <div className="person-panel__content">
      <div className="person-panel__header">
        <p className="eyebrow">Selected life</p>
        <div className="monogram" style={{ background: person.accent }}>{person.givenName[0]}{person.familyName[0]}</div>
        <h2>{person.givenName} <em>{person.familyName}</em></h2>
        <p className="life-dates"><CalendarDays aria-hidden="true" /> {year(person.birthDate)}–{person.deathDate ? year(person.deathDate) : "present"}</p>
        <p className="person-summary">{person.summary}</p>
      </div>
      <section>
        <h3><MapPin aria-hidden="true" /> Life journey</h3>
        <ol className="journey-list">
          {journey.map((event, index) => {
            const place = getPlace(event.placeId);
            return <li key={event.id}><span>{index + 1}</span><div><strong>{event.kind} in {place?.name}</strong><small>{year(event.date)} · {place?.country}</small></div></li>;
          })}
        </ol>
      </section>
      <section>
        <h3><UsersRound aria-hidden="true" /> Family</h3>
        <div className="relation-chips">{relatives.map(({ relative, role }) => relative && <span key={`${role}-${relative.id}`}><small>{role}</small>{relative.givenName}</span>)}</div>
      </section>
      <section>
        <h3><BookOpen aria-hidden="true" /> Stories</h3>
        {personStories.length ? personStories.map((story) => <article className="story-mini" key={story.id}><small>{story.type} · {year(story.date)}</small><strong>{story.title}</strong></article>) : <p className="empty-note">No stories catalogued yet.</p>}
      </section>
    </div>
  );
}

export function PersonPanel({ person }: { person: Person }) {
  return <aside className="person-panel" aria-label={`${person.givenName} ${person.familyName} details`}><PersonPanelContent person={person} /></aside>;
}
