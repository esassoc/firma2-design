// Whether this browser is signed in to the workspace — the one thing a public
// page needs to know to show a signed-in reader what the public does not get
// (firma2-public-review-notice).
//
// THE PROTOTYPE HAS NO ACCOUNTS, so "signed in" is a flag: every workspace
// page sets it (AppLayout), and Sign out in the account menu clears it. A real
// tenant reads the session instead; this module is that seam.

// Also read, by its literal, in firma2-public-header's inline script. Change one, change the other.
const KEY = 'firma2:signed-in';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export const isSignedIn = (): boolean => {
  try {
    return storage()?.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export const setSignedIn = (on: boolean): void => {
  try {
    if (on) storage()?.setItem(KEY, '1');
    else storage()?.removeItem(KEY);
  } catch {
    // Blocked storage: the reader stays signed out, which shows them the public page as the public sees it.
  }
};
