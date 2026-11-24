# Public home map — project popup

Status: ready-for-agent
Date: 2026-11-20
Decided from `/proto/map-card` (prototype deleted).

## Decision

- **Model:** a popup on the point the reader clicked.
- **Design: "Photo top".** 304px wide. The project's Featured photo runs edge
  to edge across the card's head (16:9); then name, stage badge + lead
  organization, County and Estimated cost, and a full-width primary
  "Open project" button. Leaflet's close button sits on the photo as a round
  chip.
- Built in `firma2-public-map-band` (one `<template data-popup>` per project)
  and cloned by `firma2-project-set-map` through its `popups` slot.

## Rejected

Round 1 — what appears on click:
- **Label** (name + stage only): too little; every project needs a second click.
- **Map card** docked to the map's corner: detached from the point clicked.
- **In panel** (the list becomes the project): hides the list and goal filters.

Round 2 — the popup's design:
- **Current** (inset photo, plain lines, text link): user — "the design of it
  is what's not good".
- **Side photo** (short, wide, square photo beside text): passed over.
- **Photo cover** (name set over the photo): passed over.
