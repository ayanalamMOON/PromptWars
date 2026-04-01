# PromptWars — Two-Model Workflow + Model-Visibility Update Plan

## 1) Document metadata

- **Project:** PromptWars (GLITCH Tech Fest 2026)
- **Update theme:** Dual-model execution/judging + transparent model visibility in UI
- **Primary app:** `PromptWars_App`
- **Packaging target:** `PromptWars_Windows_Standalone`
- **Date:** 2026-03-17
- **Status:** Implementation-ready plan (includes hardening and release steps)

---

## 2) Executive summary

This update establishes a **two-model architecture** in PromptWars:

1. **Generation model** (used to generate Participant A/B outputs)
2. **Judge model** (used to score outputs and decide winner)

It also introduces **model transparency in UI** so users can see exactly which model generated outputs and which model judged the battle.

### Why this matters

- Improves judging consistency and controllability
- Preserves generation quality while reducing GPU pressure
- Makes event outcomes explainable and auditable
- Better operational fit for RTX 4060 8GB constraints

---

## 3) Goals and non-goals

## Goals

- Split model selection cleanly between generation and judging.
- Preserve backward compatibility with existing `FROZEN_MODEL` behavior.
- Surface active model names in Master and Participant experiences.
- Ensure standalone Windows installer includes all changes.
- Keep latency and reliability acceptable on local event hardware.

## Non-goals

- Introducing cloud inference orchestration.
- Rewriting scoring methodology from scratch.
- Multi-tenant/session persistence redesign.

---

## 4) Baseline and target state

## Baseline (before update)

- Single model path via `FROZEN_MODEL` defaulting to `llama3:latest`.
- Participant output generation and judging both route through same model resolver.
- No explicit UI-level visibility into active generation/judge model identities.

## Target state (after update)

- Distinct model routing:
  - `GENERATION_MODEL` => participant output generation
  - `JUDGE_MODEL` => verdict generation
- Session metadata includes active model names.
- Master participant cards display both model names after submissions.
- Participant page displays model workflow panel once submission/execution begins.
- Packaged `.exe` contains all behavior and UI updates.

---

## 5) Current canonical config (event profile)

Use these as operational defaults for RTX 4060 8GB:

- `OLLAMA_BASE_URL=http://127.0.0.1:11434`
- `GENERATION_MODEL=llama3:latest`
- `JUDGE_MODEL=llama3.2:3b`
- `FROZEN_MODEL=llama3:latest` (compat fallback)

### Generation decoding profile

- `temperature: 0.7`
- `top_p: 0.9`
- `max_tokens: 1536`

### Judge decoding profile

- `temperature: 0.1`
- `top_p: 0.2`
- `max_tokens: 700`

---

## 6) Architecture update design

## 6.1 Inference routing contract

- Add independent model selectors:
  - `getGenerationModel()`
  - `getJudgeModel()`
- Expose `getBattleModels()` for consistent session stamping and UI introspection.
- Keep `FROZEN_MODEL` as fallback to avoid breaking older envs/scripts.

## 6.2 Session data contract

Extend `GameSession` with model metadata fields:

- `generationModel?: string`
- `judgeModel?: string`

### Population strategy

- Stamp values on session creation (`POST /api/session`).
- Backfill values in submit/execute routes for pre-existing in-memory sessions.

This ensures model labels are available regardless of when session was created.

## 6.3 UI contract

- **Master page:** show generation/judge model in participant cards once submitted.
- **Participant page:** show “Active Model Workflow” panel after submission and during execute/judge/complete states.
- **State text:** dynamic wording references active model names when present.

---

## 7) Detailed implementation work breakdown

## Workstream A — Inference core (`lib/ollama.ts`)

### A1. Split model selection
- Introduce separate resolvers for generation and judge paths.
- Maintain compatibility fallback chain.

### A2. Split decoding params
- Keep generation and judge presets independent.
- Ensure judge path remains deterministic and JSON-compliant.

### A3. Export battle model metadata
- Add `getBattleModels()` helper to prevent duplicated env parsing in routes.

### A4. Error strategy
- Keep existing robust error handling and fallback verdict logic unchanged.

## Workstream B — Session and API lifecycle

### B1. Session schema extension (`lib/gameState.ts`)
- Add model metadata fields to `GameSession`.

### B2. Session creation stamping (`app/api/session/route.ts`)
- On create: resolve and persist active model names.

### B3. Backfill protection (`app/api/submit/route.ts`, `app/api/execute/route.ts`)
- If session lacks model fields, derive and patch in-place.
- Avoid UI “unknown model” state during mid-update transitions.

## Workstream C — Master UX

### C1. Participant card extension
- Add optional props for generation/judge model.
- Render compact model metadata block after submission.

### C2. Visual consistency
- Preserve existing visual hierarchy and styling language.
- Use monospace for model IDs to improve readability.

## Workstream D — Participant UX

### D1. Active workflow panel
- Introduce model panel when any of these conditions are met:
  - submitted
  - executing
  - judging
  - complete

### D2. Dynamic status copy
- Replace generic “frozen model” language with active model names.

### D3. Guard rails
- Keep panel hidden in pre-submit idle state to reduce cognitive load.

## Workstream E — Packaging and distribution

### E1. Build app
- `next build` in `PromptWars_App`.

### E2. Sync standalone runtime
- Copy `.next/standalone` + `.next/static` into Windows runtime bundle.
- Optional `public/` copy guarded by directory existence.

### E3. Rebuild installer chain
- Build launcher
- Build uninstaller
- Build NSIS setup executable

---

## 8) Acceptance criteria

## Functional

- Session includes `generationModel` and `judgeModel` once created.
- Master page shows both model names in participant boxes after submission.
- Participant page shows model workflow panel after submission.
- Execution/judging status text references active models.

## Compatibility

- If `GENERATION_MODEL`/`JUDGE_MODEL` missing, app still functions via fallback.
- Existing local scripts using `FROZEN_MODEL` continue to operate.

## Packaging

- Rebuilt `PromptWars_Setup.exe` includes updated runtime and UI behavior.

## Quality

- `npm run build` passes with no type/lint regressions.

---

## 9) Test plan (deep)

## 9.1 Unit/contract checks

- Validate `getBattleModels()` returns expected values under env combinations:
  - both vars present
  - only `FROZEN_MODEL` present
  - none present (defaults)

- Validate session schema accepts optional metadata without breaking legacy sessions.

## 9.2 API flow checks

1. Create session:
   - Confirm response contains model metadata.
2. Join A/B and start prompting:
   - Confirm metadata persists through transitions.
3. Submit prompts:
   - Confirm metadata remains in status poll payload.
4. Execute/judge:
   - Confirm metadata still present in complete session.

## 9.3 UI checks (Master)

- Before submission: no model panel in participant cards.
- After one submission: model panel appears for submitted participant card.
- After both submissions: both cards show model panel.
- During complete state: model labels still visible with outputs/verdict.

## 9.4 UI checks (Participant)

- Pre-submit: model workflow panel hidden.
- Post-submit: panel visible and accurate.
- Executing/judging: status text references correct model names.
- Complete: panel remains visible for audit transparency.

## 9.5 Performance checks (RTX 4060 8GB)

- Observe memory pressure while both generation calls run concurrently.
- Confirm judge pass remains responsive.
- Track median end-to-end round latency and confirm acceptable event cadence.

## 9.6 Packaging checks

- Verify runtime server contains participant page compiled strings:
  - `Active Model Workflow`
  - `Output generation model`
  - `Judging model`

- Verify installer outputs:
  - `PromptWars_Setup.exe`
  - `PromptWars_Uninstall.exe`

---

## 10) Operational playbook (event day)

## Pre-flight

- Confirm Ollama daemon is reachable at configured base URL.
- Confirm required models are pulled locally:
  - `llama3:latest`
  - `llama3.2:3b`

## Warm-up

- Run one test battle to warm model caches.
- Validate model names shown in Master + Participant screens.

## During event

- Keep model config fixed for fairness.
- Do not change env model names mid-bracket unless emergency rollback is required.

## Post-round audit

- Export/save session logs.
- Confirm verdict justification exists and matches visible model workflow.

---

## 11) Risks and mitigations

## Risk: judge model unavailable
- **Impact:** scoring fails or delays
- **Mitigation:** `JUDGE_MODEL` fallback to generation model; preserve fallback verdict path.

## Risk: high VRAM pressure during concurrent generation
- **Impact:** latency spikes / OOM
- **Mitigation:** cap generation `max_tokens` (already reduced to 1536), keep judge model small.

## Risk: stale session lacking model metadata
- **Impact:** UI model labels missing
- **Mitigation:** submit/execute backfill logic.

## Risk: installer packaging stale runtime
- **Impact:** `.exe` not reflecting latest UI
- **Mitigation:** enforce explicit runtime sync before installer build.

---

## 12) Rollback strategy

## Soft rollback (config only)

- Set:
  - `GENERATION_MODEL=llama3:latest`
  - `JUDGE_MODEL=llama3:latest`

This keeps two-model code path but effectively reverts to single-model behavior.

## Hard rollback (code)

- Revert `lib/ollama.ts` to single model resolver
- Remove session model metadata fields and UI panels
- Rebuild app + installer

---

## 13) Release checklist

- [ ] Confirm env values are correct on build machine
- [ ] `PromptWars_App` build passes
- [ ] Runtime sync to standalone complete
- [ ] Installer rebuilt successfully
- [ ] Sanity battle executed from packaged app
- [ ] Master and Participant model labels verified
- [ ] Session log spot-check completed

---

## 14) Post-update enhancements backlog (recommended)

1. **Judge confidence score** in verdict payload
2. **Secondary-judge tie-break** path when score gap <= threshold
3. **Per-field model presets** (law/cs/pharma tuning)
4. **Health panel** for model availability before each round
5. **Replay mode** with model metadata and prompt/output diffs

---

## 15) Success definition

The update is considered successful when:

- The app reliably uses separate generation and judge models,
- Model identities are visible at the right points in both Master and Participant UX,
- Standalone installer contains these behaviors,
- Round execution remains stable on RTX 4060 8GB hardware.
