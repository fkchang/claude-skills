---
# Copy to ~/.claude/motion-overlay.md (or set MOTION_OVERLAY) and replace every value.
# Front matter is a YAML subset so the plugin parses it with no dependencies:
# nested maps by 2-space indent, scalars (string, number, true/false, null),
# inline lists [a, b]. No block lists ("- item"), no inline maps ({a: b}), no anchors.
# Validate with: node <skill-dir>/scripts/overlay.mjs check
schema: 1

outputs:
  projects: ~/motion           # default parent directory for scaffolded projects
  deliveries: ~/motion/deliver # where final encodes are copied

budget:
  baseline: "where the numbers came from, e.g. a measured build and its date"
  # Per-session thresholds read by the spend gate and the budget guard hook.
  # null = not set. Derive them from a measured run, never from a guess.
  warn:
    calls: null
    output_tokens: null
    peak_context: null
    cache_read_tokens: null
    active_minutes: null
  stop:
    calls: null
    output_tokens: null
    peak_context: null
    cache_read_tokens: null
    active_minutes: null

default_brand: example

brands:
  example:
    name: "Example Brand"
    look: enamel               # toolkit look: riso | enamel
    palette:                   # maps 1:1 onto the toolkit's createConfig palette
      paper: "#eeeeee"
      inks: ["#222222", "#666666", "#aaaaaa"]  # exactly three separations
    tokens:                    # every named brand color, one line each, so a change is a one-line edit
      primary: "#222222"
      secondary: "#666666"
      accent: "#aaaaaa"
    fonts:
      display: "Font Family Name, path to a licensed font file"
      body: "Font Family Name, path to a licensed font file"
    logo: "path to vector logo parts (separate animatable layers)"
    sound_logo: "one-line description of the sonic signature"
    notes: "voice, motion vocabulary, do and don't"
---

# Motion overlay

Personal layer for the `motion-skills` plugin. The plugin holds no brands, budgets or
paths; this file does. Where this file and a skill disagree, this file wins.

Prose below the front matter is for humans and the model (brand story, reference art,
approval rules). Only the front matter is machine-read.
