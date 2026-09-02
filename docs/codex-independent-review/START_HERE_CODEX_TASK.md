# Codex Independent Review Task

Perform an independent review only. Do not implement the system, modify live accounts, contact prospects, spend money, or merge this PR.

## Read these files first

1. `PROJECT_AND_REVIEW_BRIEF.md`
2. `CONVERSATION_HIGHLIGHTS.md`
3. `WORKBOOK_AUDIT_MANIFEST.md` — complete cell-by-cell values and formulas from the projection workbook
4. `sources/Kimi_Initial_Assessment_and_Corrections.part1.txt`
5. `sources/Kimi_Initial_Assessment_and_Corrections.part2.txt`
6. `sources/Kimi_Initial_Assessment_and_Corrections.part3.txt`
7. `sources/Kimi_Followup_and_K3_Role_Assessment.txt`
8. `sources/Grok_Assessment_of_Conversation.part1.txt`
9. `sources/Grok_Assessment_of_Conversation.part2.txt`
10. `sources/Grok_Assessment_of_Conversation.part3.txt`
11. `sources/Grok_Assessment_of_Conversation.part4.txt`
12. `sources/Manus_Final_Conversation_Assessment.txt`

The earlier `.xlsx.b64` file was incomplete and must be ignored. Use `WORKBOOK_AUDIT_MANIFEST.md` to audit every spreadsheet formula, value, assumption, linkage, and projection driver. It contains every non-empty workbook cell.

## Required work

Perform the audit exactly as described in `PROJECT_AND_REVIEW_BRIEF.md`.

Do not accept any prior AI conclusion at face value. Verify all changing claims against current official product documentation. Clearly separate:

- verified official fact;
- reasonable inference;
- unverified claim;
- live-test requirement.

## Review outputs only

Create separate review files without changing the supplied source materials:

- `Codex_Independent_Assessment.md`
- `Codex_Revised_Architecture.md`
- `Codex_Open_Questions_and_Live_Tests.md`
- `Codex_Revised_Projections.xlsx` only if you can create it reliably; otherwise provide a complete driver-based projection table and formulas in Markdown or CSV.

End with a plain-language verdict for Mike Roetker covering:

1. The recommended day-one stack.
2. Realistic Month 1–3 cost ranges.
3. Defensible Month 1–3 revenue and profit scenarios.
4. Exactly what Mike must do versus what can be automated.
5. Whether Kimi K3 should provisionally occupy the operational-intelligence role.
6. Whether to proceed, revise, or stop the five-prospect pilot.
