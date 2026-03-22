<!--
SYNC IMPACT REPORT
==================
Version change: [TEMPLATE] → 1.0.0 (initial ratification)

Modified principles:
  - [PRINCIPLE_1_NAME] → I. User Experience First
  - [PRINCIPLE_2_NAME] → II. Recommendation Quality
  - [PRINCIPLE_3_NAME] → III. Test-First Development (NON-NEGOTIABLE)
  - [PRINCIPLE_4_NAME] → IV. Design Token Consistency
  - [PRINCIPLE_5_NAME] → V. Simplicity & Incremental Delivery

Added sections:
  - Technology Stack
  - Development Workflow

Removed sections: none

Templates requiring updates:
  - ✅ .specify/templates/plan-template.md — Constitution Check section aligns with all 5 principles;
      complexity tracking table covers principle-violation justifications as required.
  - ✅ .specify/templates/spec-template.md — User stories, acceptance scenarios, and success
      criteria sections satisfy Principles I and III requirements.
  - ✅ .specify/templates/tasks-template.md — Phase structure (Setup → Foundational → Stories)
      and test-first ordering satisfy Principle III; no task-type changes needed.
  - ✅ .claude/commands/speckit.constitution.md — No outdated agent-specific names found;
      guidance is generic.
  - ✅ .claude/commands/speckit.analyze.md — Constitution authority section is generic; no
      agent-specific names.
  - ✅ .claude/commands/speckit.plan.md — Agent context update script uses runtime detection
      (`update-agent-context.sh claude`); no hardcoded names in principle guidance.

Deferred TODOs:
  - TODO(TECH_STACK_DETAIL): Frontend framework not yet determined; marked as TBD in
    Technology Stack section. Resolve during first `/speckit.plan` execution.
-->

# travel-recommend Constitution

## Core Principles

### I. User Experience First

Every feature MUST be evaluated from the traveler's perspective.
UI MUST be accessible (WCAG 2.1 AA minimum), responsive, and operable without prior domain knowledge.
Features that add implementation complexity without measurable user value MUST NOT be merged.
Design decisions MUST be traceable to a user need documented in a spec.

**Rationale**: A recommendation tool's only value is helping travelers make confident decisions.
Complexity that obscures that goal is a defect, not a feature.

### II. Recommendation Quality

All recommendation data MUST be accurate, sourced, and freshness-dated.
Stale, uncited, or hallucinated recommendations are a higher-severity defect than a missing feature.
Any data pipeline or AI-generated content MUST include confidence scoring or source attribution
visible to the user.
Fallback behavior when data is unavailable MUST surface an honest "no data" state rather than
fabricating results.

**Rationale**: Trust is the product. A single inaccurate recommendation destroys user confidence
more than a missing feature.

### III. Test-First Development (NON-NEGOTIABLE)

TDD MUST be followed: tests are written and approved by the team, MUST fail before implementation
begins, then implementation makes them pass (Red → Green → Refactor).
No feature branch MUST be merged without passing tests for every acceptance scenario defined in
the spec.
Integration tests MUST cover new recommendation data contracts and inter-service communication.
Unit tests MUST cover domain logic (recommendation scoring, filtering, sorting).

**Rationale**: Recommendation logic is nuanced and regression-prone. Test-first ensures
specifications are unambiguous before code is written and prevents silent data-quality regressions.

### IV. Design Token Consistency

All UI styling MUST reference design tokens defined via the Specify pipeline
(`.specifyrc.json` → `output/theme.js`).
Ad-hoc color values, font sizes, or spacing values not derived from the token system MUST NOT be
introduced.
SVG assets MUST be sourced from `output/assets/vectors/` and MUST NOT embed hard-coded fill or
stroke colors.
Token updates (color, typography, font) MUST flow through the Specify export pipeline, not manual
overrides.

**Rationale**: The design token pipeline enforces brand and accessibility consistency.
Manual overrides fragment the design system and make global updates unreliable.

### V. Simplicity & Incremental Delivery

YAGNI (You Aren't Gonna Need It) applies: implement only what a current user story requires.
Each feature branch MUST deliver at least one independently testable, independently deployable
user story (MVP slice) before adding lower-priority stories.
Abstractions, helpers, and utilities MUST NOT be created unless they serve two or more existing
use cases within the codebase.
Premature optimisation MUST be justified by a measured performance baseline, not assumed need.

**Rationale**: Travel recommendation scope can expand unboundedly. Incremental delivery keeps
the product shippable and feedback loops short.

## Technology Stack

TODO(TECH_STACK_DETAIL): Frontend framework is TBD; confirm during first `/speckit.plan` run.

- **Design Tokens**: Specify pipeline → Tailwind CSS (`output/theme.js`, CommonJS, camelCase)
- **Fonts**: Specify pipeline → CSS font imports (`output/styles/fonts.css`, woff/woff2)
- **Vector Assets**: Specify pipeline → optimised SVGs (`output/assets/vectors/`, SVGO)
- **AI Agent**: Claude (claude-sonnet-4-6 or later Anthropic model)
- **Version Control**: Git, GitHub (`claude-orgnization/travel-recommend`), default branch `dev`
- **Speckit Version**: 0.3.2

All technology additions MUST be documented in the feature's `plan.md` under Technical Context
before implementation begins.

## Development Workflow

- All work MUST be done on numbered feature branches off `dev`
  (sequential: `001-feature-name`, `002-feature-name`, …).
- Feature branches MUST be merged to `dev` via Pull Request with at least one reviewer approval.
- The `main` branch is reserved for production releases; direct commits to `main` are prohibited.
- Each PR MUST include a passing test suite and a completed Constitution Check in `plan.md`.
- Spec artifacts (`spec.md`, `plan.md`, `tasks.md`) MUST be committed alongside implementation
  changes so design intent is preserved in history.
- Breaking changes to recommendation data contracts MUST be versioned and communicated in the
  PR description before merge.

## Governance

This constitution supersedes all other development practices, guidelines, and informal agreements.
Any practice not covered here defaults to the principle of Simplicity (Principle V).

**Amendment procedure**:
1. Open a GitHub issue describing the proposed change and its motivation.
2. Update `.specify/memory/constitution.md` via `/speckit.constitution` command.
3. Increment version per semantic versioning rules defined in this document.
4. Obtain approval from at least one other project contributor before merging.
5. Propagate changes to all dependent templates (recorded in the Sync Impact Report).

**Versioning policy**:
- MAJOR: Removal or backward-incompatible redefinition of a principle.
- MINOR: New principle or section added; material expansion of existing guidance.
- PATCH: Clarifications, wording improvements, typo fixes.

**Compliance**: All PRs and `/speckit.analyze` runs MUST verify compliance with this constitution.
Constitution violations detected during analysis are automatically CRITICAL severity and block merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-22 | **Last Amended**: 2026-03-22
