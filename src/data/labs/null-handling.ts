import { LabManifestSchema, type LabManifest } from "../../types/manifest";

export const nullHandlingLab: LabManifest = LabManifestSchema.parse({
  "schemaVersion": "1.1",
  "id": "null-handling",
  "version": 1,
  "title": "Null Handling",
  "tier": "beginner",
  "track": "SQL Fundamentals",
  "difficulty": "easy",
  "accessLevel": "free",
  "tags": [
    "sql",
    "fundamentals",
    "null",
    "handling",
    "action-rationale"
  ],
  "description": "Practice null handling inside a realistic analytics workflow, choose the safest decision, and explain why it is the most trustworthy SQL or data move.",
  "estimatedMinutes": 10,
  "learningObjectives": [
    "Clarify the stakeholder need behind null handling.",
    "Choose a reliable SQL or analytics pattern for sql fundamentals.",
    "Validate row grain, assumptions, and edge cases before sharing a result.",
    "Communicate the tradeoff between speed and trustworthiness."
  ],
  "sortOrder": 5,
  "status": "published",
  "prerequisites": [
    {
      "labId": "calculated-columns",
      "minScore": 60
    }
  ],
  "rendererType": "action-rationale",
  "scenarios": [
    {
      "type": "action-rationale",
      "id": "null-handling-scenario-1",
      "title": "Choose the strongest SQL approach",
      "context": "analytics lead needs a reliable answer for null handling before the weekly review. Pick the action that keeps the query auditable and the result grain stable under deadline pressure.",
      "displayFields": [
        {
          "label": "Dataset",
          "value": "warehouse.products"
        },
        {
          "label": "Deadline",
          "value": "30 minutes",
          "emphasis": "warn"
        },
        {
          "label": "Risk",
          "value": "A duplicated join would overstate the KPI",
          "emphasis": "critical"
        }
      ],
      "evidence": [
        "A previous report failed because analysts reconciled totals after exporting to spreadsheets.",
        "The metric owner asked for logic that can be peer reviewed and reused next sprint."
      ],
      "actions": [
        {
          "id": "action-validated-query",
          "label": "Start from the required business grain, validate joins, and test the aggregate.",
          "color": "green"
        },
        {
          "id": "action-spreadsheet",
          "label": "Pull a broad extract first and clean the duplicates manually in a spreadsheet.",
          "color": "yellow"
        },
        {
          "id": "action-fast-number",
          "label": "Ship a fast estimate now and revisit the query only if someone questions it.",
          "color": "red"
        }
      ],
      "correctActionId": "action-validated-query",
      "rationales": [
        {
          "id": "rationale-grain",
          "text": "Preserving row grain before aggregation keeps the number trustworthy and easier to review."
        },
        {
          "id": "rationale-manual",
          "text": "Spreadsheet cleanup hides logic, makes auditing harder, and tends to repeat the same mistakes."
        },
        {
          "id": "rationale-fast",
          "text": "Publishing an unvalidated number creates trust debt that costs more time later."
        }
      ],
      "correctRationaleId": "rationale-grain",
      "feedback": {
        "perfect": "Excellent. Null Handling is strongest when you keep the grain explicit and validate the joins before sharing a metric.",
        "partial": "Close. You saw part of the risk, but the safest answer still starts by protecting row grain and validating the logic in SQL.",
        "wrong": "That choice adds avoidable risk. For null handling, the best move is the option that stays reviewable and grain-aware."
      }
    },
    {
      "type": "action-rationale",
      "id": "null-handling-scenario-2",
      "title": "Handle the stakeholder follow-up",
      "context": "After your first draft, the analytics lead asks for one more slice of null handling by region. Decide how to respond without turning a clean query into a fragile one-off.",
      "displayFields": [
        {
          "label": "Current asset",
          "value": "null-handling_draft.sql"
        },
        {
          "label": "Requested slice",
          "value": "Region comparison"
        },
        {
          "label": "Expectation",
          "value": "Reusable logic",
          "emphasis": "warn"
        }
      ],
      "actions": [
        {
          "id": "action-refactor",
          "label": "Refactor the query so the grouping logic stays explicit and reusable.",
          "color": "green"
        },
        {
          "id": "action-copy-paste",
          "label": "Duplicate the original query into a second file and patch the new grouping by hand.",
          "color": "yellow"
        },
        {
          "id": "action-hide-gap",
          "label": "Leave the logic as-is and explain that regional detail is out of scope.",
          "color": "red"
        }
      ],
      "correctActionId": "action-refactor",
      "rationales": [
        {
          "id": "rationale-reusable",
          "text": "A small refactor is safer than duplicating logic because it keeps future changes aligned."
        },
        {
          "id": "rationale-duplicate",
          "text": "Copying queries creates parallel logic that drifts quickly and becomes harder to trust."
        },
        {
          "id": "rationale-scope",
          "text": "Rejecting a valid follow-up without proposing a safe path blocks useful analysis."
        }
      ],
      "correctRationaleId": "rationale-reusable",
      "feedback": {
        "perfect": "Well done. Reusable SQL is easier to review, explain, and maintain than fast duplicates.",
        "partial": "Partly right. The key is not just to answer the question, but to do it in a way the team can reuse.",
        "wrong": "That response either creates duplicate logic or avoids the request entirely. The best answer is a controlled refactor."
      }
    },
    {
      "type": "action-rationale",
      "id": "null-handling-scenario-3",
      "title": "Explain why the result is trustworthy",
      "context": "You are presenting null handling in a team review. Choose the explanation that best demonstrates sound analytics judgment.",
      "displayFields": [
        {
          "label": "Audience",
          "value": "Cross-functional review"
        },
        {
          "label": "Goal",
          "value": "Defend the metric logic"
        },
        {
          "label": "Known concern",
          "value": "Possible duplicate events",
          "emphasis": "critical"
        }
      ],
      "actions": [
        {
          "id": "action-logic-first",
          "label": "Walk through the grain, filters, and validation checks before showing the final number.",
          "color": "green"
        },
        {
          "id": "action-result-first",
          "label": "Lead with the number and skip the query logic unless someone pushes back.",
          "color": "yellow"
        },
        {
          "id": "action-confidence",
          "label": "Emphasize that the number feels directionally right even if validation is still in progress.",
          "color": "red"
        }
      ],
      "correctActionId": "action-logic-first",
      "rationales": [
        {
          "id": "rationale-defensible",
          "text": "A defensible metric is explained through grain, filtering, and validation rather than confidence alone."
        },
        {
          "id": "rationale-delay",
          "text": "Skipping the logic invites confusion and makes it harder to catch errors before decisions are made."
        },
        {
          "id": "rationale-directional",
          "text": "Directionally right numbers still create risk when they are presented as final."
        }
      ],
      "correctRationaleId": "rationale-defensible",
      "feedback": {
        "perfect": "Exactly. Trust in analytics comes from transparent logic and explicit validation, not just a polished answer.",
        "partial": "You are thinking about communication, but the best explanation starts with the validation logic itself.",
        "wrong": "That explanation leaves too much unproven. The strongest answer shows how the result was checked before it was shared."
      }
    }
  ],
  "hints": [
    "Start by naming the business grain that null handling should produce.",
    "Check whether joins, filters, or refresh settings could change the answer unexpectedly.",
    "Choose the option you would be comfortable handing to another analyst for review."
  ],
  "scoring": {
    "maxScore": 100,
    "hintPenalty": 5,
    "penalties": {
      "perfect": 0,
      "partial": 10,
      "wrong": 20
    },
    "passingThresholds": {
      "pass": 75,
      "partial": 50
    }
  },
  "careerInsight": "Reliable SQL fundamentals are the fastest way to become useful on analytics, reporting, and data engineering teams. Null Handling is a common scenario in interviews, production reviews, and cross-functional planning.",
  "toolRelevance": [
    "PostgreSQL",
    "SQLite",
    "DBeaver"
  ],
  "createdAt": "2026-03-29T00:00:00.000Z",
  "updatedAt": "2026-03-29T00:00:00.000Z"
});
