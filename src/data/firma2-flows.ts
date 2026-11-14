// Guided flows — clickable walks through the real screens, one person at a
// time. firma2-flow-guide reads these and follows the reader from page to page.
//
// A STEP IS A PLACE, A PERSON AND ONE ACT. `href` opens the screen as `as`
// (the ?as= switch in lib/workspace-permissions), and `body` says the one thing
// to do there. The guide never does the act for you: the point of the flow is
// that the screens carry it.
//
// INVENTED, like every fixture: Rosa Iñiguez (the newcomer, NEWCOMER in
// firma2-access-requests) and Dana Whitfield (the directory's administrator).

import { NEWCOMER, organizationRequestId } from './firma2-access-requests';
import { CURRENT_USER } from './firma2-directory';

export type FlowPersona = 'newcomer' | 'admin';

export interface FlowStep {
  title: string;
  body: string;
  as: FlowPersona;
  /** Root-relative, base-less; the guide applies the base. */
  href: string;
}

export interface Flow {
  id: string;
  title: string;
  steps: FlowStep[];
}

export const personaLabel: Record<FlowPersona, string> = {
  newcomer: `${NEWCOMER.name}, new to the workspace`,
  admin: `${CURRENT_USER.name}, administrator`,
};

const RCD = 'Sierra Valley Resource Conservation District';
const PROJECT = '/prototypes/projects/truckee-river-streambank-stabilization';

export const FLOWS: Flow[] = [
  {
    id: 'access-requests',
    title: 'Getting access',
    steps: [
      {
        title: 'Sign in for the first time',
        body: 'Rosa consults on a Truckee River project. Choose any way to sign in.',
        as: 'newcomer',
        href: '/prototypes/sign-in',
      },
      {
        title: 'Skip the first question',
        body: 'Her own district isn’t here yet, and the project is what she needs today. Choose Skip for now.',
        as: 'newcomer',
        href: '/prototypes/welcome',
      },
      {
        title: 'Ask to edit the project',
        body: 'Choose Request edit access in the top bar and send it. It goes to the organization that leads the project.',
        as: 'newcomer',
        href: PROJECT,
      },
      {
        title: 'Approve Rosa',
        body: 'You’re Dana now. Approve Rosa under Requests. Truckee Basin Conservancy’s manager sees the same request on their Members page.',
        as: 'admin',
        href: '/prototypes/workspace-settings/users',
      },
      {
        title: 'Rosa can edit',
        body: 'Back as Rosa: Edit is in the top bar, and Record work is on the measures.',
        as: 'newcomer',
        href: PROJECT,
      },
      {
        title: 'Request her own district',
        body: 'Sierra Valley RCD isn’t listed. The form is filled in. Send the request.',
        as: 'newcomer',
        href: `/prototypes/welcome/new-organization?${new URLSearchParams({
          name: RCD,
          type: 'Resource conservation district',
          website: 'sierravalleyrcd.org',
          message: 'We run the Sierra Valley meadow restoration work and report to the Board.',
        })}`,
      },
      {
        title: 'Approve the new organization',
        body: 'As Dana: her email matches the website she gave. Approve, and Rosa becomes its first manager.',
        as: 'admin',
        href: `/prototypes/workspace-settings/organizations/requests/${organizationRequestId(RCD)}`,
      },
      {
        title: 'Catch a look-alike',
        body: 'This came from a personal email and resembles Feather Headwaters Trust. Add Marcus there instead, or decline it.',
        as: 'admin',
        href: '/prototypes/workspace-settings/organizations/requests/rq-feather',
      },
      {
        title: 'Where Rosa stands',
        body: 'Back as Rosa: both answers are at the top of the page. Join an organization, in her account menu, lists every request.',
        as: 'newcomer',
        href: '/prototypes/join',
      },
    ],
  },
];

export const getFlow = (id: string): Flow | undefined => FLOWS.find((f) => f.id === id);
