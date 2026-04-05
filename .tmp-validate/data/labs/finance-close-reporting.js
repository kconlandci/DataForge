"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeCloseReportingLab = void 0;
const manifest_1 = require("../../types/manifest");
exports.financeCloseReportingLab = manifest_1.LabManifestSchema.parse({
    "schemaVersion": "1.1",
    "id": "finance-close-reporting",
    "version": 1,
    "title": "Finance Close Reporting",
    "tier": "intermediate",
    "track": "Business Intelligence",
    "difficulty": "moderate",
    "accessLevel": "premium",
    "tags": [
        "business",
        "intelligence",
        "finance",
        "close",
        "reporting",
        "triage-remediate"
    ],
    "description": "Practice finance close reporting inside a realistic analytics workflow, choose the safest decision, and explain why it is the most trustworthy SQL or data move.",
    "estimatedMinutes": 14,
    "learningObjectives": [
        "Clarify the stakeholder need behind finance close reporting.",
        "Choose a reliable SQL or analytics pattern for business intelligence.",
        "Validate row grain, assumptions, and edge cases before sharing a result.",
        "Communicate the tradeoff between speed and trustworthiness."
    ],
    "sortOrder": 80,
    "status": "published",
    "prerequisites": [
        {
            "labId": "marketing-attribution-reporting",
            "minScore": 60
        }
    ],
    "rendererType": "triage-remediate",
    "scenarios": [
        {
            "type": "triage-remediate",
            "id": "finance-close-reporting-scenario-1",
            "title": "Triage the broken result",
            "description": "A delivery team escalated finance close reporting after seeing an unexpected spike. Classify the issue, pick the right remediation, and explain your decision.",
            "evidence": [
                {
                    "type": "query output",
                    "content": "The bi.support_metrics result set doubled after a new dimension join was released."
                },
                {
                    "type": "quality alert",
                    "content": "Distinct business entities stayed almost flat while row count expanded sharply."
                },
                {
                    "type": "stakeholder note",
                    "content": "The sales director needs a trusted answer before tomorrow's review."
                }
            ],
            "classifications": [
                {
                    "id": "data-quality-incident",
                    "label": "Data Quality Incident",
                    "description": "A technical issue is corrupting the reported result."
                },
                {
                    "id": "logic-design-issue",
                    "label": "Logic or Design Issue",
                    "description": "The query or model design no longer matches the intended metric."
                },
                {
                    "id": "expected-business-variance",
                    "label": "Expected Business Variance",
                    "description": "The change reflects real business behavior and needs no intervention."
                }
            ],
            "correctClassificationId": "logic-design-issue",
            "remediations": [
                {
                    "id": "remediate-audit-grain",
                    "label": "Audit the join grain and patch the logic before publishing.",
                    "description": "Stops the inflated metric from spreading."
                },
                {
                    "id": "remediate-comment",
                    "label": "Add a caveat to the report and keep the current number live.",
                    "description": "Keeps the delivery date intact but leaves risk in place."
                },
                {
                    "id": "remediate-ignore",
                    "label": "Ignore the change unless another team reports the same issue.",
                    "description": "Assumes the spike is harmless."
                }
            ],
            "correctRemediationId": "remediate-audit-grain",
            "rationales": [
                {
                    "id": "rat-logic",
                    "text": "A large row-count jump with a nearly flat entity count usually points to a logic or grain issue."
                },
                {
                    "id": "rat-caveat",
                    "text": "A caveat does not reduce the risk of a broken metric driving a decision."
                },
                {
                    "id": "rat-ignore",
                    "text": "Waiting for more complaints allows the same flawed number to spread."
                }
            ],
            "correctRationaleId": "rat-logic",
            "feedback": {
                "perfect": "Strong triage. You identified the logic issue quickly and chose the remediation that protects downstream decisions.",
                "partial": "You identified part of the risk, but the best response is still to patch the grain issue before publishing.",
                "wrong": "That path leaves a broken result active. This issue should be triaged as a logic problem and remediated in the query."
            }
        },
        {
            "type": "triage-remediate",
            "id": "finance-close-reporting-scenario-2",
            "title": "Classify the stale dashboard",
            "description": "A shared dashboard built on finance close reporting is stale after a failed refresh. Decide how to classify and remediate the issue.",
            "evidence": [
                {
                    "type": "refresh log",
                    "content": "The scheduled build failed on a schema cast mismatch and the dashboard never refreshed."
                },
                {
                    "type": "dashboard banner",
                    "content": "Freshness warning is visible, but the page still allows export."
                },
                {
                    "type": "team request",
                    "content": "Leadership is asking whether they can still use the dashboard for today's meeting."
                }
            ],
            "classifications": [
                {
                    "id": "data-quality-incident",
                    "label": "Data Quality Incident",
                    "description": "The published data no longer reflects a trustworthy current state."
                },
                {
                    "id": "logic-design-issue",
                    "label": "Logic or Design Issue",
                    "description": "The metric definition itself is incorrect."
                },
                {
                    "id": "expected-business-variance",
                    "label": "Expected Business Variance",
                    "description": "The dashboard is correct and the business changed."
                }
            ],
            "correctClassificationId": "data-quality-incident",
            "remediations": [
                {
                    "id": "remediate-mark-stale",
                    "label": "Mark the dashboard stale, stop exports, and investigate the failed refresh.",
                    "description": "Protects stakeholders from using outdated data."
                },
                {
                    "id": "remediate-use-old",
                    "label": "Continue using yesterday's snapshot until someone confirms there is a real issue.",
                    "description": "Prioritizes continuity over freshness."
                },
                {
                    "id": "remediate-force-run",
                    "label": "Force a rerun immediately without reviewing the schema mismatch.",
                    "description": "Attempts a quick fix without root-cause review."
                }
            ],
            "correctRemediationId": "remediate-mark-stale",
            "rationales": [
                {
                    "id": "rat-stale-incident",
                    "text": "A failed refresh plus an exportable stale dashboard is a data quality incident, not normal variance."
                },
                {
                    "id": "rat-use-old",
                    "text": "Old data can still mislead if it is presented as current in a decision setting."
                },
                {
                    "id": "rat-force-run",
                    "text": "Forcing a run before understanding the failure risks publishing another bad snapshot."
                }
            ],
            "correctRationaleId": "rat-stale-incident",
            "feedback": {
                "perfect": "Exactly. You treated the stale dashboard as a quality incident and chose the remediation that protects users first.",
                "partial": "You recognized some of the urgency, but the best response is to block stale exports and investigate deliberately.",
                "wrong": "That choice would leave a stale dashboard active or rush a broken fix. Mark it stale and triage the failure first."
            }
        },
        {
            "type": "triage-remediate",
            "id": "finance-close-reporting-scenario-3",
            "title": "Close the definition mismatch",
            "description": "A metric built for finance close reporting changed meaning after a silent definition update. Classify the issue and choose the best remediation.",
            "evidence": [
                {
                    "type": "change note",
                    "content": "A developer updated the logic but skipped the metric change log because the SQL still passed tests."
                },
                {
                    "type": "report impact",
                    "content": "Three reports now disagree on the same KPI definition for the current month."
                },
                {
                    "type": "owner feedback",
                    "content": "The sales director wants a correction, a root-cause note, and a safer handoff next time."
                }
            ],
            "classifications": [
                {
                    "id": "data-quality-incident",
                    "label": "Data Quality Incident",
                    "description": "The source data itself is malformed."
                },
                {
                    "id": "logic-design-issue",
                    "label": "Logic or Design Issue",
                    "description": "A definition or modeling change broke consistency across reports."
                },
                {
                    "id": "expected-business-variance",
                    "label": "Expected Business Variance",
                    "description": "The KPI changed because the business changed."
                }
            ],
            "correctClassificationId": "logic-design-issue",
            "remediations": [
                {
                    "id": "remediate-backfill-doc",
                    "label": "Correct the definition, backfill affected reports, and add release notes plus review rules.",
                    "description": "Fixes the current mismatch and reduces future drift."
                },
                {
                    "id": "remediate-new-metric",
                    "label": "Create a new metric name and leave the old reports unchanged.",
                    "description": "Avoids backfill but leaves conflicting history in place."
                },
                {
                    "id": "remediate-accept",
                    "label": "Accept the change because automated tests passed.",
                    "description": "Treats consistency gaps as acceptable noise."
                }
            ],
            "correctRemediationId": "remediate-backfill-doc",
            "rationales": [
                {
                    "id": "rat-definition",
                    "text": "Conflicting KPI definitions across reports are a logic and governance issue that require correction plus documentation."
                },
                {
                    "id": "rat-new-metric",
                    "text": "A new name alone does not resolve already shared reporting conflicts."
                },
                {
                    "id": "rat-tests",
                    "text": "Passing tests do not guarantee the business definition remained aligned."
                }
            ],
            "correctRationaleId": "rat-definition",
            "feedback": {
                "perfect": "Well done. You treated the mismatch as a definition issue and chose a remediation that restores trust in the reporting layer.",
                "partial": "You moved toward a fix, but the safest answer also accounts for backfill and clearer change management.",
                "wrong": "That response leaves conflicting definitions active. This should be triaged as a logic issue and corrected end-to-end."
            }
        }
    ],
    "hints": [
        "Start by naming the business grain that finance close reporting should produce.",
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
    "careerInsight": "Good BI work is not just chart building; it is metric definition, stakeholder alignment, and clear storytelling. Finance Close Reporting is a common scenario in interviews, production reviews, and cross-functional planning.",
    "toolRelevance": [
        "Looker",
        "Power BI",
        "Tableau"
    ],
    "createdAt": "2026-03-29T00:00:00.000Z",
    "updatedAt": "2026-03-29T00:00:00.000Z"
});
