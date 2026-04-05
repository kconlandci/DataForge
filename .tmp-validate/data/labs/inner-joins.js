"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.innerJoinsLab = void 0;
const manifest_1 = require("../../types/manifest");
exports.innerJoinsLab = manifest_1.LabManifestSchema.parse({
    "schemaVersion": "1.1",
    "id": "inner-joins",
    "version": 1,
    "title": "Inner Joins",
    "tier": "beginner",
    "track": "SQL Fundamentals",
    "difficulty": "easy",
    "accessLevel": "free",
    "tags": [
        "sql",
        "fundamentals",
        "inner",
        "joins",
        "investigate-decide"
    ],
    "description": "Practice inner joins inside a realistic analytics workflow, choose the safest decision, and explain why it is the most trustworthy SQL or data move.",
    "estimatedMinutes": 10,
    "learningObjectives": [
        "Clarify the stakeholder need behind inner joins.",
        "Choose a reliable SQL or analytics pattern for sql fundamentals.",
        "Validate row grain, assumptions, and edge cases before sharing a result.",
        "Communicate the tradeoff between speed and trustworthiness."
    ],
    "sortOrder": 7,
    "status": "published",
    "prerequisites": [
        {
            "labId": "case-expressions",
            "minScore": 60
        }
    ],
    "rendererType": "investigate-decide",
    "scenarios": [
        {
            "type": "investigate-decide",
            "id": "inner-joins-scenario-1",
            "title": "Investigate the surprising output",
            "objective": "A operations manager flagged a surprising result while reviewing inner joins. Inspect the evidence and decide the best next step before the metric is shared more widely.",
            "investigationData": [
                {
                    "id": "source-query",
                    "label": "Query Result Sample",
                    "content": "Rows from warehouse.customers show a 14% jump after a new join was added yesterday. Distinct entity count increased only 1%.",
                    "isCritical": true
                },
                {
                    "id": "source-note",
                    "label": "Analyst Note",
                    "content": "The analyst mentioned that the requested slice introduced a one-to-many relationship they did not fully validate.",
                    "isCritical": true
                },
                {
                    "id": "source-stakeholder",
                    "label": "Stakeholder Message",
                    "content": "The operations manager needs a reliable explanation before presenting this number to leadership."
                }
            ],
            "actions": [
                {
                    "id": "action-audit-join",
                    "label": "Audit the join grain, reconcile counts, and hold the metric until validated.",
                    "color": "green"
                },
                {
                    "id": "action-publish-with-note",
                    "label": "Publish the number now with a note that the logic is still being reviewed.",
                    "color": "yellow"
                },
                {
                    "id": "action-hide-alert",
                    "label": "Dismiss the jump as a likely business spike and move on.",
                    "color": "red"
                }
            ],
            "correctActionId": "action-audit-join",
            "rationales": [
                {
                    "id": "rat-audit",
                    "text": "A large KPI jump with a nearly flat entity count is a classic sign of grain or duplication problems."
                },
                {
                    "id": "rat-note",
                    "text": "A caveat does not make an unvalidated metric safe for leadership decisions."
                },
                {
                    "id": "rat-dismiss",
                    "text": "Treating unexplained variance as normal can normalize broken logic."
                }
            ],
            "correctRationaleId": "rat-audit",
            "feedback": {
                "perfect": "Correct. You investigated the evidence, recognized the grain risk, and protected the stakeholder from a bad metric.",
                "partial": "You saw some of the risk, but the safest choice is to audit the join and hold the number until it reconciles.",
                "wrong": "That decision would let an unexplained metric spread. Investigate the grain and reconcile first."
            }
        },
        {
            "type": "investigate-decide",
            "id": "inner-joins-scenario-2",
            "title": "Resolve the freshness conflict",
            "objective": "Two teams are quoting different outputs for inner joins. Review the evidence and decide how to respond.",
            "investigationData": [
                {
                    "id": "source-dashboard",
                    "label": "Dashboard Snapshot",
                    "content": "The executive dashboard shows last refresh at 08:00 ET and highlights a freshness warning.",
                    "isCritical": true
                },
                {
                    "id": "source-run-log",
                    "label": "Pipeline Run Log",
                    "content": "The latest scheduled job failed on a schema cast error at 07:47 ET and never rebuilt the semantic layer.",
                    "isCritical": true
                },
                {
                    "id": "source-chat",
                    "label": "Team Chat",
                    "content": "The operations manager asks whether the 08:00 dashboard can still be used for today's review."
                }
            ],
            "actions": [
                {
                    "id": "action-mark-stale",
                    "label": "Mark the dashboard stale, share the failure, and give an ETA after triage.",
                    "color": "green"
                },
                {
                    "id": "action-share-old",
                    "label": "Use the older dashboard anyway because the trend direction is probably unchanged.",
                    "color": "yellow"
                },
                {
                    "id": "action-refresh-manual",
                    "label": "Force a manual refresh immediately without checking the failed cast.",
                    "color": "red"
                }
            ],
            "correctActionId": "action-mark-stale",
            "rationales": [
                {
                    "id": "rat-stale",
                    "text": "Freshness warnings plus a failed pipeline run mean the dataset should not be treated as current."
                },
                {
                    "id": "rat-old",
                    "text": "Directionally similar numbers still create risk when the source is explicitly stale."
                },
                {
                    "id": "rat-manual",
                    "text": "Rushing a refresh before understanding the failure can spread a broken model faster."
                }
            ],
            "correctRationaleId": "rat-stale",
            "feedback": {
                "perfect": "Well handled. You protected the stakeholder by making the freshness issue explicit and avoiding a rushed refresh.",
                "partial": "You identified some of the urgency, but the best response is to mark the asset stale and communicate clearly.",
                "wrong": "That response ignores the evidence. A failed refresh and warning banner mean the output should be treated as stale."
            }
        },
        {
            "type": "investigate-decide",
            "id": "inner-joins-scenario-3",
            "title": "Decide how to close the incident",
            "objective": "You have narrowed the issue behind inner joins. Review the final evidence and choose the best closeout action.",
            "investigationData": [
                {
                    "id": "source-root-cause",
                    "label": "Root Cause Note",
                    "content": "The issue traced back to a definition change that was merged without updating downstream documentation.",
                    "isCritical": true
                },
                {
                    "id": "source-impact",
                    "label": "Impact Review",
                    "content": "Three weekly reports and one dashboard tile used the outdated definition for two business days.",
                    "isCritical": true
                },
                {
                    "id": "source-owner",
                    "label": "Metric Owner Response",
                    "content": "The owner wants a fix, an explanation, and a way to prevent the same miss next time."
                }
            ],
            "actions": [
                {
                    "id": "action-fix-and-document",
                    "label": "Correct the definition, backfill the affected outputs, and document the change path.",
                    "color": "green"
                },
                {
                    "id": "action-fix-only",
                    "label": "Patch the logic and move on now that the root cause is known.",
                    "color": "yellow"
                },
                {
                    "id": "action-blame",
                    "label": "Close the incident by naming the merge author and leaving the current reports alone.",
                    "color": "red"
                }
            ],
            "correctActionId": "action-fix-and-document",
            "rationales": [
                {
                    "id": "rat-closeout",
                    "text": "Good closeout includes correction, impact handling, and a preventive step the team can follow later."
                },
                {
                    "id": "rat-fix-only",
                    "text": "A silent fix leaves confusion in already shared reports and does not reduce repeat risk."
                },
                {
                    "id": "rat-blame",
                    "text": "Blame without remediation does not restore trust in the reported metric."
                }
            ],
            "correctRationaleId": "rat-closeout",
            "feedback": {
                "perfect": "Excellent closeout. You fixed the logic, handled the reporting impact, and improved the team's process.",
                "partial": "You moved toward resolution, but the best answer also accounts for backfill and preventive documentation.",
                "wrong": "That closeout leaves too much unresolved. Data incidents need correction, impact handling, and prevention."
            }
        }
    ],
    "hints": [
        "Start by naming the business grain that inner joins should produce.",
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
    "careerInsight": "Reliable SQL fundamentals are the fastest way to become useful on analytics, reporting, and data engineering teams. Inner Joins is a common scenario in interviews, production reviews, and cross-functional planning.",
    "toolRelevance": [
        "PostgreSQL",
        "SQLite",
        "DBeaver"
    ],
    "createdAt": "2026-03-29T00:00:00.000Z",
    "updatedAt": "2026-03-29T00:00:00.000Z"
});
