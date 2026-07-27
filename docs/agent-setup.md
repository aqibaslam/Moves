# Agent setup

The 41 skills in `.claude/skills/` are already vendored into this repo — they work
offline with no install step. This file covers the two things that must be installed
separately, plus MCP credentials.

## Plugin marketplaces (you must run these)

`/plugin` opens an interactive terminal panel, so it can't be run from an agent session.
Run these yourself in an interactive `claude` terminal from the repo root.

Both are **global** installs — they affect every project, not just Moves.

### Superpowers — obra/superpowers

An agentic skills framework: TDD, systematic debugging, verification-before-completion,
brainstorming, writing/executing plans, dispatching parallel agents, git worktrees.

```bash
claude
```

then, inside the session:

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

The same marketplace also carries `superpowers-chrome`, `episodic-memory`,
`elements-of-style`, and `claude-session-driver`. Install those only if you want them —
each one adds context to every session.

### Bencium UX designer

```
/plugin marketplace add bencium/bencium-marketplace
/plugin install bencium-innovative-ux-designer@bencium-marketplace
/plugin install bencium-controlled-ux-designer@bencium-marketplace
```

- `bencium-innovative-ux-designer` — pushes for distinctive frontends, actively avoids
  the generic AI-generated aesthetic
- `bencium-controlled-ux-designer` — the opposite posture: asks before changing colour,
  type, or layout

They pull in opposite directions by design. Install both and invoke whichever suits the
task, or pick one.

> Note: the repo was renamed. `bencium/bencium-claude-code-design-skill` now redirects to
> `bencium/bencium-marketplace` — use the new slug.

## Vercel React Native — nothing to install

There is no skills repo under `github.com/vercel`. The real one is
[`vercel-labs/agent-skills`](https://github.com/vercel-labs/agent-skills), and four of its
skills are **already vendored here**: `react-native-skills`, `composition-patterns`,
`react-best-practices`, and `web-design-guidelines`.

To pull the rest (`deploy-to-vercel`, `react-view-transitions`, `vercel-optimize`,
`vercel-cli-with-tokens`, `writing-guidelines`):

```bash
npx skills add vercel-labs/agent-skills
```

It is not a Claude Code plugin marketplace — `/plugin marketplace add` will not work on it.

## MCP credentials

`.mcp.json` is committed; secrets are not. Put them in `.env.local`:

| Server | Needs | Where to get it |
|---|---|---|
| `figma` | `FIGMA_API_KEY` | Figma → Settings → Security → Personal access tokens |
| `supabase` | nothing | OAuth prompt on first use |
| `accesslint` | nothing | — |
| `playwright` | nothing | — |
| `context7` | nothing | — |

The Supabase server is pinned `read_only=true` in the URL. Scope it to one project by
appending `&project_ref=<your-ref>` once the project exists. To allow writes, drop
`read_only=true` — do that deliberately, not by accident.

> Your other projects have Figma keys committed directly into `.mcp.json`. This repo
> reads `${FIGMA_API_KEY}` from the environment instead, so the token never lands in git.
> Worth rotating the two exposed keys if those repos are pushed anywhere.
