// Tags — functional labels on a project, with no KPIs. "Is this an education
// and outreach project?" A tag answers a yes/no question a program manager
// filters by; it is not a goal anyone reports progress toward (that is a
// classification) and it does not shape the project's page (that is its
// project type). Settled 2026-10-03, user-directed.
//
// A CLOSED LIST, like every other vocabulary here: a free-typed tag is how
// "Education & outreach" and "Outreach/education" become two filters that
// each find half the projects. Administrators add to the list in Workspace
// settings › Tags; a project picks from it.
//
// GROUPED AND COLOURED. Tags sort into groups an administrator arranges in
// Workspace settings › Tags, and every tag and group carries a colour, so a
// long list reads as a few kinds of label rather than one run of names. The
// order of the groups, and of the tags within each, is the order every tag
// picker offers them in. (User-directed, 2026-10-03.)
//
// INVENTED CONTENT.

import { projects } from './firma2-projects';
import type { TagName } from './firma2-projects';

export interface TagGroup {
  slug: string;
  name: string;
  description: string;
  color: string;
}

export interface Tag {
  slug: string;
  name: TagName;
  /** What earns a project the tag — the test a sponsor applies when choosing it. */
  description: string;
  /** The TAG_GROUPS slug; empty for a tag in no group. */
  group: string;
  color: string;
}

/**
 * The colours a new tag or group is dealt at random: the stage swatches
 * (src/data/firma2-workspace-settings.ts) less grey, which reads as "none".
 * Kept here, not imported, so the browser-side store does not pull in the
 * settings data. All clear 3 : 1 on white as a mark.
 */
export const TAG_COLORS = ['#0d74ce', '#167a7a', '#218358', '#2a7e3b', '#ab6400', '#b5621f', '#a8324a', '#6a5aa8', '#1f3a5f'];

export const randomTagColor = (): string => TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];

export const TAG_GROUPS: TagGroup[] = [
  { slug: 'partners', name: 'Partners', description: '', color: '#6a5aa8' },
  { slug: 'community', name: 'Community', description: '', color: '#0d74ce' },
  { slug: 'climate-and-fire', name: 'Climate & fire', description: '', color: '#b5621f' },
];

export const TAGS: Tag[] = [
  { slug: 'tribal-partnership', name: 'Tribal partnership', description: 'A tribe is a partner in planning, doing or monitoring the work.', group: 'partners', color: '#6a5aa8' },
  { slug: 'private-landowners', name: 'Private landowners', description: 'The work touches private land and depends on landowner agreements.', group: 'partners', color: '#1f3a5f' },
  { slug: 'volunteer-led', name: 'Volunteer-led', description: 'Volunteers do a substantial share of the field work.', group: 'community', color: '#167a7a' },
  { slug: 'education-and-outreach', name: 'Education & outreach', description: 'Includes school programs, public events, signage or workshops.', group: 'community', color: '#0d74ce' },
  { slug: 'climate-adaptation', name: 'Climate adaptation', description: 'Designed for higher temperatures, sea-level rise or shifting flows.', group: 'climate-and-fire', color: '#218358' },
  { slug: 'post-fire-recovery', name: 'Post-fire recovery', description: 'Responds to damage from a recent wildfire.', group: 'climate-and-fire', color: '#a8324a' },
];

/** How many projects carry each tag — the settings list and the filter read it. */
export const tagCount = (name: TagName): number => projects.filter((p) => p.tags.includes(name)).length;
