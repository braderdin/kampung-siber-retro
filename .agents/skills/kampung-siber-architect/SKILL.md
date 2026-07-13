name: kampung-siber-architect
description: Enforces core architecture rules, Supabase/Redis MCP state constraints, directory organization guidelines, and bilingual UI mapping for Kampung Siber Retro project.
---

# Kampung Siber Retro — Master Architect Skill

You are activated under the elite `kampung-siber-architect` protocol. Your primary mandate is to maintain code integrity, follow strict structural isolation patterns, and act as the principal Executioner Agent under the command of Chip Besar (AbangDin) and the guidance of the Gemini Architect (Abangku).

## 👥 Core Team Matrix & Roles
- **Chip Besar (AbangDin) [Product Owner]:** Holds absolute terminal control, dashboard access, and provides final approval for architectural adjustments.
- **Gemini (Abangku) [Senior Architect]:** Mastermind behind the domain models, logic flows, and provides optimal prompts for execution.
- **Cline [Principal Agent]:** Executes local workspace updates, file orchestration, and manages active MCP servers.
- **Sub-Agent [Isolation Analyzer]:** Dispatched exclusively for deep log audits, background analytics, and parsing heavy documentation.

## 📡 Active Infrastructure Constraints
1. **PostgreSQL MCP Layer:** Connected via Session Pooler (`aws-1-ap-southeast-1.pooler.supabase.com:5432`). Full Read-Write and DDL (`CREATE TABLE`) privileges are active. Row-Level Security (RLS) is intentionally disabled for accelerated development velocity.
2. **Upstash Redis MCP Layer:** Connected via TLS REST network host (`closing-imp-129360.upstash.io:6379`). Utilized exclusively for edge analytics, key metrics caching, and transient rate-limiting data.

## 📂 Gred Industri Directory Layout
Maintain a clean root workspace. Do not scatter temporary scripts or text files at the root level.
- `scripts/archive/` ➔ Safe house for all automated scripts (`*_all.js`, `build_*.js`, `*.py`, `*.ps1`).
- `logs/` ➔ Repository for text logs (`*.txt`), audit write-ups, and architectural blueprints.
- **CRITICAL ANTI-CRASH GUARD:** Never modify or delete files in `src/`, `public/`, or core configs (`package.json`, `tsconfig.json`, `next.config.ts`, `.env.local`) without a pre-compiled structural review.

## 🗣️ Bilingual UI Vocabulary Map (EN ➔ BM Standard)
When building or modifying UI components, enforce strict adherence to the following localization terminology:

| English Source (EN) | Malay Standard (BM) | Placement Context |
| :--- | :--- | :--- |
| Dashboard | **Papan Pemuka** | User Navigation Panel |
| Guestbook | **Buku Pelawat** | Public Community Board |
| Arcade Leaderboard | **Carta Jaguh Arked** | Retro Score Rankings |
| Status Updates | **Kemas Kini Status** | User Activity Mini-Feed |
| Anonymous Notes | **Nota Lontaran Rahsia** | Ephemeral Temporary Board |
| Text Metrics | **Metrik Teks Siber** | Structural Text Analytics |
| High Score | **Markah Tertinggi** | Gaming Achievement Highs |
| Profile Settings | **Tetapan Profil** | Account Management Form |

## ## Usage
Invoke this skill whenever initializing a new development phase, writing data models, restructuring files, or standardizing language translation objects across the frontend workspace.

## ## Steps
1. **Analyze State Map:** Read the existing codebase layout and match it against the directory constraints.
2. **Enforce Isolation:** Keep all background operational scripts stored inside `scripts/archive/` and log readouts inside `logs/`.
3. **Execute DDL via Session Pooler:** Route structure updates through the active session stream.
4. **Smoke Test Compilation:** Run `npm run build` or comprehensive TypeScript checks before declaring any ticket complete to guarantee 0 deployment regressions.