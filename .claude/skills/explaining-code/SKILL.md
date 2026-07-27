---
name: explaining-code
description: Explain how a piece of code, component, or system works — clearly, at the right altitude, for the audience. Use when the user asks "how does this work / what does this do / walk me through", or when onboarding someone to a file or flow.
---

# Explaining Code

Use when the user wants to **understand** code rather than change it.

## Method
1. **Start with the one-sentence purpose.** What problem does this code solve, in plain terms, before any detail.
2. **Give the shape before the specifics.** Inputs → what happens → outputs. Name the key pieces (functions, state, data flow) and how they connect.
3. **Then zoom in** only on the parts that matter to the question. Skip boilerplate.
4. **Explain the *why*, not just the *what*.** Call out non-obvious decisions, gotchas, and trade-offs (e.g. "forced `muted` on the DOM because React doesn't set the attribute in SSR").
5. **Use the reader's vocabulary.** Match their apparent level; define a term the first time if needed.
6. **Reference real locations** as `file_path:line` so they can jump to the code.

## Format
- Lead with a plain-English summary (2–3 sentences).
- Follow with a short structured breakdown (steps, or a bulleted map of the parts).
- Include a tiny example or trace when it clarifies (e.g. "when the toggle is clicked → `setMode('chairflow')` → the bars re-render at the new percentages").
- End with any caveats or "watch out for…".

## Avoid
- Narrating every line.
- Jargon without grounding.
- Restating the code in prose without adding understanding.

Keep it as short as it can be while still answering the actual question.
