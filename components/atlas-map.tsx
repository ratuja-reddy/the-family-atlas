"use client";

import { divIcon } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { people, relationships } from "@/src/data/family-data";
import { getJourney, getPlace, getPrimaryPlaceForPerson } from "@/src/models/selectors";

interface AtlasMapProps {
  selectedPersonId: string;
  onSelectPerson: (personId: string) => void;
}

const personIcon = (initials: string, selected: boolean, colour: string) =>
  divIcon({
    className: "atlas-marker-shell",
    html: `<span class="atlas-marker${selected ? " is-selected" : ""}" style="--marker-colour:${colour}">${initials}</span>`,
    iconAnchor: [22, 22],
    iconSize: [44, 44],
  });

export function AtlasMap({ selectedPersonId, onSelectPerson }: AtlasMapProps) {
  const journey = getJourney(selectedPersonId);
  const journeyCoordinates = journey
    .map((event) => getPlace(event.placeId)?.coordinates)
    .filter((coordinates): coordinates is [number, number] => Boolean(coordinates));

  const relationshipLines = relationships.flatMap((relationship) => {
    const ids = relationship.type === "partner" ? relationship.personIds : [relationship.parentId, relationship.childId];
    const points = ids.map((id) => getPrimaryPlaceForPerson(id)?.coordinates).filter((point): point is [number, number] => Boolean(point));
    return points.length === 2 ? [{ relationship, points }] : [];
  });

  return (
    <MapContainer center={[34, 2]} zoom={2} minZoom={2} maxZoom={7} scrollWheelZoom className="atlas-map" aria-label="World map showing family places">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {relationshipLines.map(({ relationship, points }) => (
        <Polyline
          key={relationship.id}
          positions={points}
          pathOptions={{
            color: relationship.type === "partner" ? "#a8653f" : "#486c54",
            weight: relationship.type === "partner" ? 2 : 3,
            dashArray: relationship.type === "partner" ? "8 9" : undefined,
            opacity: 0.58,
          }}
        />
      ))}
      {journeyCoordinates.length > 1 && (
        <Polyline positions={journeyCoordinates} pathOptions={{ color: "#a8653f", weight: 2, dashArray: "2 8", opacity: 0.95 }} />
      )}
      {people.map((person) => {
        const place = getPrimaryPlaceForPerson(person.id);
        if (!place) return null;
        const isSelected = person.id === selectedPersonId;
        return (
          <Marker
            key={person.id}
            position={place.coordinates}
            icon={personIcon(`${person.givenName[0]}${person.familyName[0]}`, isSelected, person.accent)}
            eventHandlers={{ click: () => onSelectPerson(person.id), keydown: (event) => {
              const original = event.originalEvent as KeyboardEvent;
              if (original.key === "Enter" || original.key === " ") onSelectPerson(person.id);
            } }}
            title={`${person.givenName} ${person.familyName}, ${place.name}`}
          >
            <Tooltip direction="top" offset={[0, -18]}>{person.givenName} {person.familyName}</Tooltip>
          </Marker>
        );
      })}
      {journey.map((event, index) => {
        const place = getPlace(event.placeId);
        if (!place) return null;
        return (
          <Marker
            key={event.id}
            position={place.coordinates}
            icon={divIcon({ className: "journey-stop-shell", html: `<span class="journey-stop">${index + 1}</span>`, iconAnchor: [12, 12], iconSize: [24, 24] })}
            interactive={false}
          />
        );
      })}
    </MapContainer>
  );
}
