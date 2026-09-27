import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(cleanup);

vi.mock("next/dynamic", () => ({
  default: () => function MockAtlasMap() { return <div aria-label="World map showing family places">Map</div>; },
}));

import { FamilyAtlasApp } from "@/components/family-atlas-app";

describe("FamilyAtlasApp", () => {
  it("changes the selected person's details from the person chooser", async () => {
    const user = userEvent.setup();
    render(<FamilyAtlasApp />);

    await user.selectOptions(screen.getByLabelText("Choose a person"), "anna");

    expect(screen.getByRole("heading", { name: "Anna Vale" })).toBeTruthy();
    expect(screen.getByText(/1951–present/)).toBeTruthy();
    expect(screen.getByText(/Born in Liverpool/i)).toBeTruthy();
  });

  it("moves between the coordinated Atlas, Lineage and Stories views", async () => {
    const user = userEvent.setup();
    render(<FamilyAtlasApp />);

    await user.click(screen.getByRole("tab", { name: "Lineage" }));
    expect(screen.getByRole("heading", { name: "The family line" })).toBeTruthy();

    await user.click(screen.getByRole("tab", { name: "Stories" }));
    expect(screen.getByRole("heading", { name: "Stories carried forward" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "The blue harbour letters" })).toBeTruthy();
  });
});
