# Skills

Multi-step ASO workflows for [Claude Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview), built on the AppmanAi MCP tools.

## Install

Connect the [AppmanAi connector](../README.md#install) first — a skill is only instructions, the data comes from the tools.

Then copy the folder you want:

```bash
# available in one project
mkdir -p .claude/skills && cp -r skills/aso-keyword-audit .claude/skills/

# available everywhere
cp -r skills/aso-keyword-audit ~/.claude/skills/
```

Ask for it by name, or just describe the task — the description in each `SKILL.md` is what the agent matches against.

## What is here

| Skill | Use it when |
| --- | --- |
| [`aso-keyword-audit`](aso-keyword-audit) | You need a prioritised keyword shortlist for an app in one market |
| [`competitor-gap`](competitor-gap) | You want the terms rivals rank for and you don't |
| [`rank-drop-triage`](rank-drop-triage) | A ranking moved and you need to know whether it was you |
| [`review-mining`](review-mining) | You want the recurring complaints behind a rating |

Each one is plain Markdown that calls read-only tools. Read it before you run it, and note the credit cost written into each step — a full audit is roughly 40–70 credits depending on list size.
