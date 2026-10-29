---
name: readme-glowup
description: Give a repo an edgy, shareable README with a hero image. Use when the user says "sexify the README", "glow up the README", "make the README pop", "edgy README", "add a hero image", or wants a project README to match their other repos' style. Studies sibling READMEs for house style, pitches image concepts and taglines for approval, generates the hero image, writes the README, scrubs personal data, and only pushes on a yes.
---

# readme-glowup

Turn a plain README into one people actually read: hero image, one-line promise, a tiny code block, a pain paragraph with attitude, real usage, a collapsible long story.

**First, read the operator overlay if it exists:** `~/.claude/readme-glowup-overlay.md`. It names the sibling repos to study, the recurring character, the palette rule, and the image route. Schema: `overlay.example.md` next to this file. Without an overlay, use the repo's own siblings (step 1) and the defaults below.

## Steps

1. **Study the house style (do this before pitching).** Read 3 to 4 sibling READMEs (overlay list, else the user's other repos with a `README.md` and `assets/` hero) and look at their hero images. Note: image composition (before/after split vs themed scene), character or mascot, palette, tagline shape, section order. Match the family, but pick a palette distinct from each sibling's.
2. **Understand the project.** Read its code, docs and git log enough to state the real pain it removes, a 1-line usage, and 3 to 4 real usage snippets you have actually run. Never invent features or output.
3. **Pitch, do not generate yet.** Show the user: the sibling pattern in 5 lines, 2 image concepts (A: before/after split matching the family, B: themed scene), 2 or 3 taglines, and whether the character should look like them or stay generic. Wait for the pick. Taglines that work: a promise in 6 to 10 words, second person, concrete ("Record yourself once. Never again.").
4. **Generate the hero image** (see Image route). Always look at the result before committing. Check: every requested beat is present, no garbled text beyond the 1 to 2 words you asked for, no logos or real people.
5. **Write the README.** Order: title, 2 or 3 badges, hero, bold tagline, tiny code block, "That's it.", `## Why` (pain, with attitude, 2 short paragraphs), `## Real-world usage` (3 to 4 bold-lead snippets), `## Install`, `## How it works` (table, `|---|---|` separators, exactly 3 hyphens), options/CLI reference, consent or safety notes if relevant, `<details>` for the long story or FAQ, license. Plain ASCII punctuation: no em-dashes.
6. **Scrub before it can go public.** Grep the repo for the user's home path, usernames, employer or private terms, personal voice/profile names, tokens. Move personal prefs to an untracked config plus a `config.example`. If the repo is going public and history contains any of it, squash to one clean commit on a fresh branch before pushing. Add a LICENSE if missing.
7. **Commit locally; push only on an explicit yes.** Commit explicit paths only. Showing the result then asking is the rule: pushing a public README is outward-facing.

## Image route

Prefer the user's configured image generator (overlay). Default: Codex's built-in image tool via the codex CLI.

- Run from the repo directory, in **one** background command with no inner `&`, stdin closed: `codex exec -m <model> -s workspace-write --skip-git-repo-check --output-last-message <file> "$(cat prompt.txt)" < /dev/null > log 2>&1`. Wrapping it in a second `&` kills the process when the launcher shell exits.
- `-s workspace-write` is required: the default sandbox may be read-only and the image cannot be saved. Do not use a danger/full-access flag.
- Put the prompt in a file; tell Codex to save to `assets/hero.jpg` in the repo, to stop and say so if it cannot generate images (no code-drawn substitutes), and to verify the JPEG's dimensions and size.
- Prompt skeleton: wide 16:9 about 1672x941; style matched to named reference images (give file paths); palette; SCENE LEFT (before, the pain, with concrete props and one joke prop); SCENE RIGHT (after, the tool in use with its actual command typed on screen, the output flowing to an agent or deliverable); TEXT whitelist (only the 1 to 3 strings you want rendered); no logos, no real people, no brand marks.

## Do not

- Generate the image or push before the user has picked the concept and tagline.
- Claim usage you did not run or numbers you did not measure.
- Leave personal paths, usernames or private voice or profile names in a public repo or its history.
