import { LabManifestSchema, type LabManifest } from "../../types/manifest";

export const reportingGrainAlignmentLab: LabManifest = LabManifestSchema.parse({
  "schemaVersion": "1.1",
  "id": "reporting-grain-alignment",
  "version": 1,
  "title": "Reporting Grain Alignment",
  "tier": "beginner",
  "track": "Business Intelligence",
  "difficulty": "easy",
  "accessLevel": "free",
  "tags": [
    "business",
    "intelligence",
    "reporting",
    "grain",
    "alignment",
    "toggle-config"
  ],
  "description": "Practice reporting grain alignment inside a realistic analytics workflow, choose the safest decision, and explain why it is the most trustworthy SQL or data move.",
  "estimatedMinutes": 10,
  "learningObjectives": [
    "Clarify the stakeholder need behind reporting grain alignment.",
    "Choose a reliable SQL or analytics pattern for business intelligence.",
    "Validate row grain, assumptions, and edge cases before sharing a result.",
    "Communicate the tradeoff between speed and trustworthiness."
  ],
  "sortOrder": 74,
  "status": "published",
  "prerequisites": [
    {
      "labId": "metric-layer-governance",
      "minScore": 60
    }
  ],
  "rendererType": "toggle-config",
  "scenarios": [
    {
      "type": "toggle-config",
      "id": "reporting-grain-alignment-scenario-1",
      "title": "Configure the default quality controls",
      "description": "You are preparing a shared asset for reporting grain alignment. Set the defaults so the sales director gets trustworthy results without relying on tribal knowledge.",
      "targetSystem": "bi.support_metrics.semantic_model",
      "items": [
        {
          "id": "grain-check",
          "label": "Row Grain Check",
          "detail": "Controls whether the transformation verifies one output row per business entity before publishing.",
          "currentState": "warn",
          "correctState": "strict",
          "states": [
            "off",
            "warn",
            "strict"
          ],
          "rationaleId": "rat-grain"
        },
        {
          "id": "null-policy",
          "label": "Null Handling Policy",
          "detail": "Determines how missing values are surfaced when an analyst reuses the model.",
          "currentState": "silent-fill",
          "correctState": "flag-and-document",
          "states": [
            "silent-fill",
            "flag-and-document",
            "drop-row"
          ],
          "rationaleId": "rat-null"
        },
        {
          "id": "owner-review",
          "label": "Metric Owner Review",
          "detail": "Defines whether changes to shared definitions require a second reviewer.",
          "currentState": "optional",
          "correctState": "required",
          "states": [
            "optional",
            "required"
          ],
          "rationaleId": "rat-review"
        }
      ],
      "rationales": [
        {
          "id": "rat-grain",
          "text": "Strict grain checks catch inflated metrics before they reach a dashboard or stakeholder deck."
        },
        {
          "id": "rat-null",
          "text": "Flagging missing values makes assumptions explicit and prevents silent bias in downstream reporting."
        },
        {
          "id": "rat-review",
          "text": "Shared metric logic should be reviewed because a small definition change can affect multiple teams."
        }
      ],
      "feedback": {
        "perfect": "Great configuration. Reporting Grain Alignment becomes safer to reuse when quality checks, null policies, and reviews are explicit.",
        "partial": "Close, but one or more defaults still leave room for silent data quality failures.",
        "wrong": "These settings leave too much to chance. Shared analytics assets need stronger defaults than ad hoc analysis."
      }
    },
    {
      "type": "toggle-config",
      "id": "reporting-grain-alignment-scenario-2",
      "title": "Set access and change controls",
      "description": "A wider audience wants self-service access to reporting grain alignment. Configure the model so speed does not outrun governance.",
      "targetSystem": "bi.support_metrics.reporting_view",
      "items": [
        {
          "id": "access-scope",
          "label": "Access Scope",
          "detail": "Determines who can edit the logic behind the shared dataset.",
          "currentState": "team-edit",
          "correctState": "least-privilege",
          "states": [
            "open-edit",
            "team-edit",
            "least-privilege"
          ],
          "rationaleId": "rat-access"
        },
        {
          "id": "definition-versioning",
          "label": "Definition Versioning",
          "detail": "Controls whether metric definition changes are tracked with change notes.",
          "currentState": "optional",
          "correctState": "required",
          "states": [
            "optional",
            "required"
          ],
          "rationaleId": "rat-versioning"
        },
        {
          "id": "freshness-warning",
          "label": "Freshness Warning",
          "detail": "Controls whether stale data is surfaced before a user exports a report.",
          "currentState": "hidden",
          "correctState": "visible",
          "states": [
            "hidden",
            "visible"
          ],
          "rationaleId": "rat-freshness"
        }
      ],
      "rationales": [
        {
          "id": "rat-access",
          "text": "Least-privilege editing reduces accidental logic drift in shared datasets."
        },
        {
          "id": "rat-versioning",
          "text": "Versioned definitions help analysts explain why a KPI changed between reporting periods."
        },
        {
          "id": "rat-freshness",
          "text": "Visible freshness warnings stop teams from treating stale snapshots as current truth."
        }
      ],
      "feedback": {
        "perfect": "Nice work. You balanced self-service access with the controls needed to protect shared metrics.",
        "partial": "Partly right. Governance gaps remain whenever editing, versioning, or freshness are left ambiguous.",
        "wrong": "That setup prioritizes convenience over trust. Shared BI assets need tighter controls."
      }
    },
    {
      "type": "toggle-config",
      "id": "reporting-grain-alignment-scenario-3",
      "title": "Tune the publish workflow",
      "description": "The team wants a faster release cycle for reporting grain alignment. Configure the publish workflow so the team can move quickly without normalizing broken output.",
      "targetSystem": "bi.support_metrics.publish_job",
      "items": [
        {
          "id": "test-suite",
          "label": "Pre-Publish Test Suite",
          "detail": "Controls whether checks run before the model is marked production ready.",
          "currentState": "manual",
          "correctState": "automatic",
          "states": [
            "manual",
            "automatic"
          ],
          "rationaleId": "rat-tests"
        },
        {
          "id": "rollback-plan",
          "label": "Rollback Plan",
          "detail": "Determines whether a fallback path is captured before a release is approved.",
          "currentState": "optional",
          "correctState": "required",
          "states": [
            "optional",
            "required"
          ],
          "rationaleId": "rat-rollback"
        },
        {
          "id": "release-note",
          "label": "Release Note Detail",
          "detail": "Controls how much context goes out with a metric or schema change.",
          "currentState": "minimal",
          "correctState": "decision-ready",
          "states": [
            "minimal",
            "decision-ready"
          ],
          "rationaleId": "rat-release-note"
        }
      ],
      "rationales": [
        {
          "id": "rat-tests",
          "text": "Automatic tests reduce the odds that a rushed change ships incorrect business logic."
        },
        {
          "id": "rat-rollback",
          "text": "A rollback plan is part of a safe release, especially for metrics leaders depend on daily."
        },
        {
          "id": "rat-release-note",
          "text": "Decision-ready notes help downstream teams understand whether changes affect interpretation."
        }
      ],
      "feedback": {
        "perfect": "Exactly. Faster delivery only works when testing, rollback, and communication stay part of the workflow.",
        "partial": "You improved part of the process, but the publish workflow still has avoidable failure points.",
        "wrong": "This workflow would speed up releases at the cost of trust. Production data work needs stronger safeguards."
      }
    }
  ],
  "hints": [
    "Start by naming the business grain that reporting grain alignment should produce.",
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
  "careerInsight": "Good BI work is not just chart building; it is metric definition, stakeholder alignment, and clear storytelling. Reporting Grain Alignment is a common scenario in interviews, production reviews, and cross-functional planning.",
  "toolRelevance": [
    "Looker",
    "Power BI",
    "Tableau"
  ],
  "createdAt": "2026-03-29T00:00:00.000Z",
  "updatedAt": "2026-03-29T00:00:00.000Z"
});
