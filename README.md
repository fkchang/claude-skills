# claude-skills

Public (world-tier) Claude Code skills. Generic tooling only: no personal paths, no employer
specifics. Personal behavior layers on through local overlay files that each skill reads if present.

## Plugins

| Plugin | Skills | What |
|---|---|---|
| `lean-coordinator` | `fable-lean`, `opus-lean` | Model-tier coordinator discipline: keep the frontier main thread lean, gate delegation, tune effort, escalate on evidence (Advisor pattern), offload cross-vendor |
| `motion-skills` | `motion-studio`, `motion-craft`, `motion-render`, `motion-sound`, `social-video-delivery` | Code-driven motion design: a parametrized rendering toolkit (versioned template directory), platform delivery presets, animation-principle recipes, sound, and a budget-guarded studio workflow |

`lean-coordinator` reads `~/.claude/lean-overlay.md` if present for your budget, owned accounts,
routing table and measurement hook.

`motion-skills` reads `~/.claude/motion-overlay.md` if present for your brand kits, spend
thresholds, and output locations (schema: `plugins/motion-skills/skills/motion-studio/motion-overlay.example.md`).

## Install

```
/plugin marketplace add <this repo>
/plugin install lean-coordinator@claude-skills
```

Or symlink a skill directory into `~/.claude/skills/`.

## Scope gate

`bin/skill-scope-check` fails on absolute home paths plus any private terms listed in `~/.config/claude-skills/deny.txt` (kept outside the repo). Run it before every commit.
