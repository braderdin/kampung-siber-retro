# 🤖 KAMPUNG SIBER HYBRID AGENT CONFIGURATION (RM0 FASTRACK)

This file defines the strict split-intelligence behavior rules for the active development agents in this VSCode Cline workspace.

## 🧠 1. Orchestration & Planning Engine: Llama-3.3-70b (Groq Free Tier)
- **ROLE:** System Architecture, Feature Mapping, and Code Planning.
- **TOKEN LIMIT ENFORCEMENT (12K TPM / 100K TPD):** Groq has a critical token ceiling[cite: 3]. You must strictly express plans in raw, concise blueprints[cite: 3]. 
- **NO CHATTY PROSE:** Eliminate standard greetings, file summaries, and conceptual walkthroughs[cite: 3]. Move instantly to the architectural action points[cite: 3].
- **MAX 5-LINE BLUEPRINTS:** Keep the text outline underneath 5 lines per task to prevent triggering HTTP 429 Rate Limit blocks[cite: 3].

## 🏗️ 2. Automated Execution Engine: Poolside Laguna-XS-2.1 (OpenRouter Free)
- **ROLE:** Code Generation, File Operations, and Bug Squashing[cite: 3, 4].
- **FULL STRUCTURAL REWRITES:** When generating, refactoring, or updating files, you are commanded to output the **FULL and complete** code structure.
- **ANTI-LAZY CODE BAN:** You are strictly forbidden from cutting corners or utilizing shorthand placeholders such as `// code remains the same`, `// ... rest of code`, or `// insert logic here`[cite: 4].
- **Surgical Explanations:** Keep debugging explanations down to exactly one sentence, then immediately proceed with the full code block generation or system-tool execution[cite: 4].