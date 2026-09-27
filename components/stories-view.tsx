import { BookHeart, Camera, CookingPot, Mail } from "lucide-react";
import { stories } from "@/src/data/family-data";
import { getPerson, getPlace } from "@/src/models/selectors";

const typeIcon = { memory: BookHeart, photograph: Camera, letter: Mail, recipe: CookingPot };

export function StoriesView({ onSelectPerson }: { onSelectPerson: (personId: string) => void }) {
  return (
    <section className="stories-stage" aria-labelledby="stories-heading">
      <div className="stage-heading stories-heading">
        <div><p className="eyebrow">The collected archive</p><h1 id="stories-heading">Stories carried forward</h1></div>
        <p>Each fragment is anchored to the lives, places and dates it remembers.</p>
      </div>
      <div className="stories-grid">
        {stories.map((story, index) => {
          const Icon = typeIcon[story.type];
          return (
            <article className={`story-card story-card--${index + 1}`} key={story.id}>
              <div className="story-card__top"><span><Icon aria-hidden="true" /> {story.type}</span><time dateTime={story.date}>{new Date(`${story.date}T00:00:00`).getFullYear()}</time></div>
              <h2>{story.title}</h2>
              <p>{story.excerpt}</p>
              <div className="story-places">{story.placeIds.map((id) => { const place = getPlace(id); return place ? <span key={id}>{place.name}, {place.country}</span> : null; })}</div>
              <div className="story-people" aria-label="People connected to this story">
                {story.personIds.map((id) => { const person = getPerson(id); return person ? <button type="button" key={id} onClick={() => onSelectPerson(id)}><i style={{ background: person.accent }}>{person.givenName[0]}{person.familyName[0]}</i>{person.givenName} {person.familyName}</button> : null; })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
