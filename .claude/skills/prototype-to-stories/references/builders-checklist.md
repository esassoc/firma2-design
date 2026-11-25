# The builder's checklist

Run this over every story before it is called written. A prototype shows each thing once, in its clean case; a builder needs the rule behind it and what happens off the clean path. For each line that applies, the story either states the answer or cites the question that asks it. Silence is the defect.

Answer from the prototype's code first. The inventory names the files and lines for each item the story covers; open them and read the logic, because the inventory is a summary and the rule is usually in the code. What the code decides on purpose is a requirement. What it does by accident, or does not do, is a question. A behavior that exists only because of the component the prototype happened to use (a picker with no way to clear it) is a question too, unless a decision backs it.

A crossing of two states usually needs two stories to show. Put it in whichever of the two is built second, and add the first to its `Blocked by`. Skip a line when another story owns the answer; name that story under "Needs to know" if this one leans on it. A clause that only repeats another story's rule needs no scenario here. If answering the checklist takes a story well past the scenario limit, look for a split that leaves both halves demonstrable alone.

**Every value a person can type or pick**
- What is accepted: kind, format, range, length, required or not.
- How it is shown back (separators, decimals, units, currency).
- What happens when it is cleared again after being filled.

**Every match or comparison** ("already on file", "not in this workspace", "same person")
- What is compared with what, and how exactly (case, spacing, partial names, which fields are ignored).
- When it is worked out, and whether it is worked out again after the person edits.
- What happens when two things match, or nothing does.
- The same thing twice within one input (two lines of one report that would both be added), not only against what is already stored.

**Every state an element can be in**
- What the person sees and can do in it.
- What happens where it meets each other state the same element can be in, and which wins. The same for checks: when more than one trips on one item, which message or flag shows.
- What takes the element out of the state, and what the screen shows then (does the badge go, does the message go).
- The all-or-none cases: every row in this state, no row in it, nothing left to act on.

**Every message**
- What makes it appear, what removes it, and whether two can show at once.
- That it is visible in every mode the screen has (a message under a control that is hidden in another mode is never seen).

**Every list or group**
- What decides the order.
- What it shows when empty.
- Whether two identical entries can both appear.

**Every action**
- What it does when pressed with nothing to act on.
- What the person sees when the action itself fails (the save, the undo, the send), and whether they can try again.
- What it does to things in each state.
- For an action that reverses another (undo, revert, remove): what it does when the thing was changed by hand in between, for each kind of thing it reverses.
- Whether a rule checked on the way in (who may do this, is the value valid) is checked again when the action is taken.
- For a write: what happens if the thing already exists; whether it is all or nothing; what state the result is saved in.
- What the person sees afterwards, and where they land.
- What later screens count or show when the write changed nothing.

**Everything the story writes or shows**
- Who else can see it, on every screen it appears on, and whether that agrees with any access rule on the thing it names.
- When the story says something "can be done by hand elsewhere", that the place to do it exists.

**Every dependency on another story or feature**
- When part of an action's effect belongs to a later story (undo removes the entries here, the history row there), what the person sees in between, and where this story's own effect can be observed.
- No circle: when this story hands a case to another story, check that the other story does not hand it back.
- Which story supplies the thing this one stands on (the group, the checkbox, the tally), and that it is in `Blocked by`.
- For another feature: what this story asks it and gets back, whether that feature exists, and what happens when its answer is missing or late.
- Whether more than one of the other feature's things can apply at once (two sources for one field), and which wins.
- When something is handed to another feature: what that feature accepts (kinds, sizes, limits) against what this one lets through. Open the other feature's code to check.

**Other ways of using the screen**
- What an action does while another view covers what it acts on (a narrow screen showing the document over the list).
- Whether a state or message is announced to assistive technology and reachable by keyboard.
- For anything that opens and closes: where keyboard focus goes on opening, and that Escape or the close control works from where focus actually is.
- Every other screen that draws the same component: search the code for where it is mounted, because the behavior shows up there too.
- The boundary value itself: exactly the breakpoint, exactly zero, exactly the limit.

**Asked once for the feature, not per story**
- Whether sentences that contain a renameable noun take the workspace's word.
- Whether two identical entries can both appear in a list.

Raise each of these as one question for the whole feature and cite it; do not re-ask it story by story.

**The test data**
- Every requirement's scenario has data that actually exercises it (a "the amount is not compared" rule needs two different amounts).
- What the recorded reading contains is kept apart from what the product works out from it: the first is input, the second is the expected result.
