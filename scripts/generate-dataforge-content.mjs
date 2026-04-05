import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod/v4";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const labsDir = path.join(root, "src", "data", "labs");
const catalogPath = path.join(root, "src", "data", "catalog.ts");
const pathsPath = path.join(root, "src", "data", "paths.ts");
const specs = JSON.parse(
  readFileSync(path.join(__dirname, "dataforge-topics.json"), "utf8")
);

const SCHEMA_VERSION = "1.1";
const timestamp = "2026-03-29T00:00:00.000Z";
const renderers = [
  "action-rationale",
  "toggle-config",
  "investigate-decide",
  "triage-remediate",
];
const scoring = {
  maxScore: 100,
  hintPenalty: 5,
  penalties: { perfect: 0, partial: 10, wrong: 20 },
  passingThresholds: { pass: 75, partial: 50 },
};

const LabManifestSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: z.string(),
  version: z.number().int().min(1),
  title: z.string().min(3).max(80),
  tier: z.enum(["beginner", "intermediate", "advanced"]),
  track: z.enum([
    "SQL Fundamentals",
    "Database Design",
    "Data Analysis",
    "Data Pipelines",
    "Business Intelligence",
    "Advanced Analytics",
  ]),
  difficulty: z.enum(["easy", "moderate", "challenging"]),
  accessLevel: z.enum(["free", "premium"]),
  tags: z.array(z.string()),
  description: z.string().min(10).max(300),
  estimatedMinutes: z.number().min(1).max(60),
  learningObjectives: z.array(z.string()).min(3).max(7),
  sortOrder: z.number().int(),
  status: z.enum(["draft", "published"]),
  prerequisites: z.array(
    z.object({ labId: z.string(), minScore: z.number().optional() })
  ),
  rendererType: z.enum(renderers),
  scenarios: z.array(z.any()).min(3).max(5),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  scoring: z.object({
    maxScore: z.literal(100),
    hintPenalty: z.number(),
    penalties: z.object({
      perfect: z.literal(0),
      partial: z.number(),
      wrong: z.number(),
    }),
    passingThresholds: z.object({
      pass: z.number(),
      partial: z.number(),
    }),
  }),
  careerInsight: z.string(),
  toolRelevance: z.array(z.string()).min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const pick = (list, seed) => list[seed % list.length];
const camel = (value) =>
  value
    .split("-")
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
const difficultyFor = (index, total) =>
  index < Math.ceil(total * 0.33)
    ? "easy"
    : index < Math.ceil(total * 0.75)
      ? "moderate"
      : "challenging";
const tierFor = (index, total) =>
  index < Math.ceil(total * 0.4)
    ? "beginner"
    : index < Math.ceil(total * 0.8)
      ? "intermediate"
      : "advanced";
const minutesFor = (difficulty) =>
  difficulty === "easy" ? 10 : difficulty === "moderate" ? 14 : 18;

function buildTags(spec, id, rendererType) {
  return [
    ...new Set([
      ...spec.title
        .toLowerCase()
        .split(" ")
        .map((tag) => tag.replace(/[^a-z0-9]/g, "")),
      ...id.split("-").slice(0, 4),
      rendererType,
    ]),
  ];
}

function buildObjectives(spec, title) {
  return [
    `Clarify the stakeholder need behind ${title.toLowerCase()}.`,
    `Choose a reliable SQL or analytics pattern for ${spec.title.toLowerCase()}.`,
    "Validate row grain, assumptions, and edge cases before sharing a result.",
    "Communicate the tradeoff between speed and trustworthiness.",
  ];
}

function buildHints(title) {
  return [
    `Start by naming the business grain that ${title.toLowerCase()} should produce.`,
    "Check whether joins, filters, or refresh settings could change the answer unexpectedly.",
    "Choose the option you would be comfortable handing to another analyst for review.",
  ];
}

function buildActionScenarios(lab, spec, seed) {
  const dataset = pick(spec.datasets, seed);
  const stakeholder = pick(spec.stakeholders, seed + 1);

  return [
    {
      type: "action-rationale",
      id: `${lab.id}-scenario-1`,
      title: "Choose the strongest SQL approach",
      context: `${stakeholder} needs a reliable answer for ${lab.title.toLowerCase()} before the weekly review. Pick the action that keeps the query auditable and the result grain stable under deadline pressure.`,
      displayFields: [
        { label: "Dataset", value: dataset },
        { label: "Deadline", value: "30 minutes", emphasis: "warn" },
        {
          label: "Risk",
          value: "A duplicated join would overstate the KPI",
          emphasis: "critical",
        },
      ],
      evidence: [
        "A previous report failed because analysts reconciled totals after exporting to spreadsheets.",
        "The metric owner asked for logic that can be peer reviewed and reused next sprint.",
      ],
      actions: [
        {
          id: "action-validated-query",
          label:
            "Start from the required business grain, validate joins, and test the aggregate.",
          color: "green",
        },
        {
          id: "action-spreadsheet",
          label:
            "Pull a broad extract first and clean the duplicates manually in a spreadsheet.",
          color: "yellow",
        },
        {
          id: "action-fast-number",
          label:
            "Ship a fast estimate now and revisit the query only if someone questions it.",
          color: "red",
        },
      ],
      correctActionId: "action-validated-query",
      rationales: [
        {
          id: "rationale-grain",
          text: "Preserving row grain before aggregation keeps the number trustworthy and easier to review.",
        },
        {
          id: "rationale-manual",
          text: "Spreadsheet cleanup hides logic, makes auditing harder, and tends to repeat the same mistakes.",
        },
        {
          id: "rationale-fast",
          text: "Publishing an unvalidated number creates trust debt that costs more time later.",
        },
      ],
      correctRationaleId: "rationale-grain",
      feedback: {
        perfect: `Excellent. ${lab.title} is strongest when you keep the grain explicit and validate the joins before sharing a metric.`,
        partial:
          "Close. You saw part of the risk, but the safest answer still starts by protecting row grain and validating the logic in SQL.",
        wrong: `That choice adds avoidable risk. For ${lab.title.toLowerCase()}, the best move is the option that stays reviewable and grain-aware.`,
      },
    },
    {
      type: "action-rationale",
      id: `${lab.id}-scenario-2`,
      title: "Handle the stakeholder follow-up",
      context: `After your first draft, the ${stakeholder} asks for one more slice of ${lab.title.toLowerCase()} by region. Decide how to respond without turning a clean query into a fragile one-off.`,
      displayFields: [
        { label: "Current asset", value: `${lab.id}_draft.sql` },
        { label: "Requested slice", value: "Region comparison" },
        { label: "Expectation", value: "Reusable logic", emphasis: "warn" },
      ],
      actions: [
        {
          id: "action-refactor",
          label:
            "Refactor the query so the grouping logic stays explicit and reusable.",
          color: "green",
        },
        {
          id: "action-copy-paste",
          label:
            "Duplicate the original query into a second file and patch the new grouping by hand.",
          color: "yellow",
        },
        {
          id: "action-hide-gap",
          label:
            "Leave the logic as-is and explain that regional detail is out of scope.",
          color: "red",
        },
      ],
      correctActionId: "action-refactor",
      rationales: [
        {
          id: "rationale-reusable",
          text: "A small refactor is safer than duplicating logic because it keeps future changes aligned.",
        },
        {
          id: "rationale-duplicate",
          text: "Copying queries creates parallel logic that drifts quickly and becomes harder to trust.",
        },
        {
          id: "rationale-scope",
          text: "Rejecting a valid follow-up without proposing a safe path blocks useful analysis.",
        },
      ],
      correctRationaleId: "rationale-reusable",
      feedback: {
        perfect:
          "Well done. Reusable SQL is easier to review, explain, and maintain than fast duplicates.",
        partial:
          "Partly right. The key is not just to answer the question, but to do it in a way the team can reuse.",
        wrong:
          "That response either creates duplicate logic or avoids the request entirely. The best answer is a controlled refactor.",
      },
    },
    {
      type: "action-rationale",
      id: `${lab.id}-scenario-3`,
      title: "Explain why the result is trustworthy",
      context: `You are presenting ${lab.title.toLowerCase()} in a team review. Choose the explanation that best demonstrates sound analytics judgment.`,
      displayFields: [
        { label: "Audience", value: "Cross-functional review" },
        { label: "Goal", value: "Defend the metric logic" },
        {
          label: "Known concern",
          value: "Possible duplicate events",
          emphasis: "critical",
        },
      ],
      actions: [
        {
          id: "action-logic-first",
          label:
            "Walk through the grain, filters, and validation checks before showing the final number.",
          color: "green",
        },
        {
          id: "action-result-first",
          label:
            "Lead with the number and skip the query logic unless someone pushes back.",
          color: "yellow",
        },
        {
          id: "action-confidence",
          label:
            "Emphasize that the number feels directionally right even if validation is still in progress.",
          color: "red",
        },
      ],
      correctActionId: "action-logic-first",
      rationales: [
        {
          id: "rationale-defensible",
          text: "A defensible metric is explained through grain, filtering, and validation rather than confidence alone.",
        },
        {
          id: "rationale-delay",
          text: "Skipping the logic invites confusion and makes it harder to catch errors before decisions are made.",
        },
        {
          id: "rationale-directional",
          text: "Directionally right numbers still create risk when they are presented as final.",
        },
      ],
      correctRationaleId: "rationale-defensible",
      feedback: {
        perfect:
          "Exactly. Trust in analytics comes from transparent logic and explicit validation, not just a polished answer.",
        partial:
          "You are thinking about communication, but the best explanation starts with the validation logic itself.",
        wrong:
          "That explanation leaves too much unproven. The strongest answer shows how the result was checked before it was shared.",
      },
    },
  ];
}

function buildToggleScenarios(lab, spec, seed) {
  const dataset = pick(spec.datasets, seed);
  const stakeholder = pick(spec.stakeholders, seed + 2);

  return [
    {
      type: "toggle-config",
      id: `${lab.id}-scenario-1`,
      title: "Configure the default quality controls",
      description: `You are preparing a shared asset for ${lab.title.toLowerCase()}. Set the defaults so the ${stakeholder} gets trustworthy results without relying on tribal knowledge.`,
      targetSystem: `${dataset}.semantic_model`,
      items: [
        {
          id: "grain-check",
          label: "Row Grain Check",
          detail:
            "Controls whether the transformation verifies one output row per business entity before publishing.",
          currentState: "warn",
          correctState: "strict",
          states: ["off", "warn", "strict"],
          rationaleId: "rat-grain",
        },
        {
          id: "null-policy",
          label: "Null Handling Policy",
          detail:
            "Determines how missing values are surfaced when an analyst reuses the model.",
          currentState: "silent-fill",
          correctState: "flag-and-document",
          states: ["silent-fill", "flag-and-document", "drop-row"],
          rationaleId: "rat-null",
        },
        {
          id: "owner-review",
          label: "Metric Owner Review",
          detail:
            "Defines whether changes to shared definitions require a second reviewer.",
          currentState: "optional",
          correctState: "required",
          states: ["optional", "required"],
          rationaleId: "rat-review",
        },
      ],
      rationales: [
        {
          id: "rat-grain",
          text: "Strict grain checks catch inflated metrics before they reach a dashboard or stakeholder deck.",
        },
        {
          id: "rat-null",
          text: "Flagging missing values makes assumptions explicit and prevents silent bias in downstream reporting.",
        },
        {
          id: "rat-review",
          text: "Shared metric logic should be reviewed because a small definition change can affect multiple teams.",
        },
      ],
      feedback: {
        perfect: `Great configuration. ${lab.title} becomes safer to reuse when quality checks, null policies, and reviews are explicit.`,
        partial:
          "Close, but one or more defaults still leave room for silent data quality failures.",
        wrong:
          "These settings leave too much to chance. Shared analytics assets need stronger defaults than ad hoc analysis.",
      },
    },
    {
      type: "toggle-config",
      id: `${lab.id}-scenario-2`,
      title: "Set access and change controls",
      description: `A wider audience wants self-service access to ${lab.title.toLowerCase()}. Configure the model so speed does not outrun governance.`,
      targetSystem: `${dataset}.reporting_view`,
      items: [
        {
          id: "access-scope",
          label: "Access Scope",
          detail: "Determines who can edit the logic behind the shared dataset.",
          currentState: "team-edit",
          correctState: "least-privilege",
          states: ["open-edit", "team-edit", "least-privilege"],
          rationaleId: "rat-access",
        },
        {
          id: "definition-versioning",
          label: "Definition Versioning",
          detail:
            "Controls whether metric definition changes are tracked with change notes.",
          currentState: "optional",
          correctState: "required",
          states: ["optional", "required"],
          rationaleId: "rat-versioning",
        },
        {
          id: "freshness-warning",
          label: "Freshness Warning",
          detail:
            "Controls whether stale data is surfaced before a user exports a report.",
          currentState: "hidden",
          correctState: "visible",
          states: ["hidden", "visible"],
          rationaleId: "rat-freshness",
        },
      ],
      rationales: [
        {
          id: "rat-access",
          text: "Least-privilege editing reduces accidental logic drift in shared datasets.",
        },
        {
          id: "rat-versioning",
          text: "Versioned definitions help analysts explain why a KPI changed between reporting periods.",
        },
        {
          id: "rat-freshness",
          text: "Visible freshness warnings stop teams from treating stale snapshots as current truth.",
        },
      ],
      feedback: {
        perfect:
          "Nice work. You balanced self-service access with the controls needed to protect shared metrics.",
        partial:
          "Partly right. Governance gaps remain whenever editing, versioning, or freshness are left ambiguous.",
        wrong:
          "That setup prioritizes convenience over trust. Shared BI assets need tighter controls.",
      },
    },
    {
      type: "toggle-config",
      id: `${lab.id}-scenario-3`,
      title: "Tune the publish workflow",
      description: `The team wants a faster release cycle for ${lab.title.toLowerCase()}. Configure the publish workflow so the team can move quickly without normalizing broken output.`,
      targetSystem: `${dataset}.publish_job`,
      items: [
        {
          id: "test-suite",
          label: "Pre-Publish Test Suite",
          detail:
            "Controls whether checks run before the model is marked production ready.",
          currentState: "manual",
          correctState: "automatic",
          states: ["manual", "automatic"],
          rationaleId: "rat-tests",
        },
        {
          id: "rollback-plan",
          label: "Rollback Plan",
          detail:
            "Determines whether a fallback path is captured before a release is approved.",
          currentState: "optional",
          correctState: "required",
          states: ["optional", "required"],
          rationaleId: "rat-rollback",
        },
        {
          id: "release-note",
          label: "Release Note Detail",
          detail:
            "Controls how much context goes out with a metric or schema change.",
          currentState: "minimal",
          correctState: "decision-ready",
          states: ["minimal", "decision-ready"],
          rationaleId: "rat-release-note",
        },
      ],
      rationales: [
        {
          id: "rat-tests",
          text: "Automatic tests reduce the odds that a rushed change ships incorrect business logic.",
        },
        {
          id: "rat-rollback",
          text: "A rollback plan is part of a safe release, especially for metrics leaders depend on daily.",
        },
        {
          id: "rat-release-note",
          text: "Decision-ready notes help downstream teams understand whether changes affect interpretation.",
        },
      ],
      feedback: {
        perfect:
          "Exactly. Faster delivery only works when testing, rollback, and communication stay part of the workflow.",
        partial:
          "You improved part of the process, but the publish workflow still has avoidable failure points.",
        wrong:
          "This workflow would speed up releases at the cost of trust. Production data work needs stronger safeguards.",
      },
    },
  ];
}

function buildInvestigateScenarios(lab, spec, seed) {
  const dataset = pick(spec.datasets, seed);
  const stakeholder = pick(spec.stakeholders, seed + 1);

  return [
    {
      type: "investigate-decide",
      id: `${lab.id}-scenario-1`,
      title: "Investigate the surprising output",
      objective: `A ${stakeholder} flagged a surprising result while reviewing ${lab.title.toLowerCase()}. Inspect the evidence and decide the best next step before the metric is shared more widely.`,
      investigationData: [
        {
          id: "source-query",
          label: "Query Result Sample",
          content: `Rows from ${dataset} show a 14% jump after a new join was added yesterday. Distinct entity count increased only 1%.`,
          isCritical: true,
        },
        {
          id: "source-note",
          label: "Analyst Note",
          content:
            "The analyst mentioned that the requested slice introduced a one-to-many relationship they did not fully validate.",
          isCritical: true,
        },
        {
          id: "source-stakeholder",
          label: "Stakeholder Message",
          content: `The ${stakeholder} needs a reliable explanation before presenting this number to leadership.`,
        },
      ],
      actions: [
        {
          id: "action-audit-join",
          label:
            "Audit the join grain, reconcile counts, and hold the metric until validated.",
          color: "green",
        },
        {
          id: "action-publish-with-note",
          label:
            "Publish the number now with a note that the logic is still being reviewed.",
          color: "yellow",
        },
        {
          id: "action-hide-alert",
          label: "Dismiss the jump as a likely business spike and move on.",
          color: "red",
        },
      ],
      correctActionId: "action-audit-join",
      rationales: [
        {
          id: "rat-audit",
          text: "A large KPI jump with a nearly flat entity count is a classic sign of grain or duplication problems.",
        },
        {
          id: "rat-note",
          text: "A caveat does not make an unvalidated metric safe for leadership decisions.",
        },
        {
          id: "rat-dismiss",
          text: "Treating unexplained variance as normal can normalize broken logic.",
        },
      ],
      correctRationaleId: "rat-audit",
      feedback: {
        perfect:
          "Correct. You investigated the evidence, recognized the grain risk, and protected the stakeholder from a bad metric.",
        partial:
          "You saw some of the risk, but the safest choice is to audit the join and hold the number until it reconciles.",
        wrong:
          "That decision would let an unexplained metric spread. Investigate the grain and reconcile first.",
      },
    },
    {
      type: "investigate-decide",
      id: `${lab.id}-scenario-2`,
      title: "Resolve the freshness conflict",
      objective: `Two teams are quoting different outputs for ${lab.title.toLowerCase()}. Review the evidence and decide how to respond.`,
      investigationData: [
        {
          id: "source-dashboard",
          label: "Dashboard Snapshot",
          content:
            "The executive dashboard shows last refresh at 08:00 ET and highlights a freshness warning.",
          isCritical: true,
        },
        {
          id: "source-run-log",
          label: "Pipeline Run Log",
          content:
            "The latest scheduled job failed on a schema cast error at 07:47 ET and never rebuilt the semantic layer.",
          isCritical: true,
        },
        {
          id: "source-chat",
          label: "Team Chat",
          content: `The ${stakeholder} asks whether the 08:00 dashboard can still be used for today's review.`,
        },
      ],
      actions: [
        {
          id: "action-mark-stale",
          label:
            "Mark the dashboard stale, share the failure, and give an ETA after triage.",
          color: "green",
        },
        {
          id: "action-share-old",
          label:
            "Use the older dashboard anyway because the trend direction is probably unchanged.",
          color: "yellow",
        },
        {
          id: "action-refresh-manual",
          label:
            "Force a manual refresh immediately without checking the failed cast.",
          color: "red",
        },
      ],
      correctActionId: "action-mark-stale",
      rationales: [
        {
          id: "rat-stale",
          text: "Freshness warnings plus a failed pipeline run mean the dataset should not be treated as current.",
        },
        {
          id: "rat-old",
          text: "Directionally similar numbers still create risk when the source is explicitly stale.",
        },
        {
          id: "rat-manual",
          text: "Rushing a refresh before understanding the failure can spread a broken model faster.",
        },
      ],
      correctRationaleId: "rat-stale",
      feedback: {
        perfect:
          "Well handled. You protected the stakeholder by making the freshness issue explicit and avoiding a rushed refresh.",
        partial:
          "You identified some of the urgency, but the best response is to mark the asset stale and communicate clearly.",
        wrong:
          "That response ignores the evidence. A failed refresh and warning banner mean the output should be treated as stale.",
      },
    },
    {
      type: "investigate-decide",
      id: `${lab.id}-scenario-3`,
      title: "Decide how to close the incident",
      objective: `You have narrowed the issue behind ${lab.title.toLowerCase()}. Review the final evidence and choose the best closeout action.`,
      investigationData: [
        {
          id: "source-root-cause",
          label: "Root Cause Note",
          content:
            "The issue traced back to a definition change that was merged without updating downstream documentation.",
          isCritical: true,
        },
        {
          id: "source-impact",
          label: "Impact Review",
          content:
            "Three weekly reports and one dashboard tile used the outdated definition for two business days.",
          isCritical: true,
        },
        {
          id: "source-owner",
          label: "Metric Owner Response",
          content:
            "The owner wants a fix, an explanation, and a way to prevent the same miss next time.",
        },
      ],
      actions: [
        {
          id: "action-fix-and-document",
          label:
            "Correct the definition, backfill the affected outputs, and document the change path.",
          color: "green",
        },
        {
          id: "action-fix-only",
          label:
            "Patch the logic and move on now that the root cause is known.",
          color: "yellow",
        },
        {
          id: "action-blame",
          label:
            "Close the incident by naming the merge author and leaving the current reports alone.",
          color: "red",
        },
      ],
      correctActionId: "action-fix-and-document",
      rationales: [
        {
          id: "rat-closeout",
          text: "Good closeout includes correction, impact handling, and a preventive step the team can follow later.",
        },
        {
          id: "rat-fix-only",
          text: "A silent fix leaves confusion in already shared reports and does not reduce repeat risk.",
        },
        {
          id: "rat-blame",
          text: "Blame without remediation does not restore trust in the reported metric.",
        },
      ],
      correctRationaleId: "rat-closeout",
      feedback: {
        perfect:
          "Excellent closeout. You fixed the logic, handled the reporting impact, and improved the team's process.",
        partial:
          "You moved toward resolution, but the best answer also accounts for backfill and preventive documentation.",
        wrong:
          "That closeout leaves too much unresolved. Data incidents need correction, impact handling, and prevention.",
      },
    },
  ];
}

function buildTriageScenarios(lab, spec, seed) {
  const dataset = pick(spec.datasets, seed);
  const stakeholder = pick(spec.stakeholders, seed + 2);

  return [
    {
      type: "triage-remediate",
      id: `${lab.id}-scenario-1`,
      title: "Triage the broken result",
      description: `A delivery team escalated ${lab.title.toLowerCase()} after seeing an unexpected spike. Classify the issue, pick the right remediation, and explain your decision.`,
      evidence: [
        {
          type: "query output",
          content: `The ${dataset} result set doubled after a new dimension join was released.`,
        },
        {
          type: "quality alert",
          content:
            "Distinct business entities stayed almost flat while row count expanded sharply.",
        },
        {
          type: "stakeholder note",
          content: `The ${stakeholder} needs a trusted answer before tomorrow's review.`,
        },
      ],
      classifications: [
        {
          id: "data-quality-incident",
          label: "Data Quality Incident",
          description: "A technical issue is corrupting the reported result.",
        },
        {
          id: "logic-design-issue",
          label: "Logic or Design Issue",
          description:
            "The query or model design no longer matches the intended metric.",
        },
        {
          id: "expected-business-variance",
          label: "Expected Business Variance",
          description:
            "The change reflects real business behavior and needs no intervention.",
        },
      ],
      correctClassificationId: "logic-design-issue",
      remediations: [
        {
          id: "remediate-audit-grain",
          label:
            "Audit the join grain and patch the logic before publishing.",
          description: "Stops the inflated metric from spreading.",
        },
        {
          id: "remediate-comment",
          label: "Add a caveat to the report and keep the current number live.",
          description: "Keeps the delivery date intact but leaves risk in place.",
        },
        {
          id: "remediate-ignore",
          label:
            "Ignore the change unless another team reports the same issue.",
          description: "Assumes the spike is harmless.",
        },
      ],
      correctRemediationId: "remediate-audit-grain",
      rationales: [
        {
          id: "rat-logic",
          text: "A large row-count jump with a nearly flat entity count usually points to a logic or grain issue.",
        },
        {
          id: "rat-caveat",
          text: "A caveat does not reduce the risk of a broken metric driving a decision.",
        },
        {
          id: "rat-ignore",
          text: "Waiting for more complaints allows the same flawed number to spread.",
        },
      ],
      correctRationaleId: "rat-logic",
      feedback: {
        perfect:
          "Strong triage. You identified the logic issue quickly and chose the remediation that protects downstream decisions.",
        partial:
          "You identified part of the risk, but the best response is still to patch the grain issue before publishing.",
        wrong:
          "That path leaves a broken result active. This issue should be triaged as a logic problem and remediated in the query.",
      },
    },
    {
      type: "triage-remediate",
      id: `${lab.id}-scenario-2`,
      title: "Classify the stale dashboard",
      description: `A shared dashboard built on ${lab.title.toLowerCase()} is stale after a failed refresh. Decide how to classify and remediate the issue.`,
      evidence: [
        {
          type: "refresh log",
          content:
            "The scheduled build failed on a schema cast mismatch and the dashboard never refreshed.",
        },
        {
          type: "dashboard banner",
          content:
            "Freshness warning is visible, but the page still allows export.",
        },
        {
          type: "team request",
          content:
            "Leadership is asking whether they can still use the dashboard for today's meeting.",
        },
      ],
      classifications: [
        {
          id: "data-quality-incident",
          label: "Data Quality Incident",
          description:
            "The published data no longer reflects a trustworthy current state.",
        },
        {
          id: "logic-design-issue",
          label: "Logic or Design Issue",
          description: "The metric definition itself is incorrect.",
        },
        {
          id: "expected-business-variance",
          label: "Expected Business Variance",
          description: "The dashboard is correct and the business changed.",
        },
      ],
      correctClassificationId: "data-quality-incident",
      remediations: [
        {
          id: "remediate-mark-stale",
          label:
            "Mark the dashboard stale, stop exports, and investigate the failed refresh.",
          description: "Protects stakeholders from using outdated data.",
        },
        {
          id: "remediate-use-old",
          label:
            "Continue using yesterday's snapshot until someone confirms there is a real issue.",
          description: "Prioritizes continuity over freshness.",
        },
        {
          id: "remediate-force-run",
          label:
            "Force a rerun immediately without reviewing the schema mismatch.",
          description: "Attempts a quick fix without root-cause review.",
        },
      ],
      correctRemediationId: "remediate-mark-stale",
      rationales: [
        {
          id: "rat-stale-incident",
          text: "A failed refresh plus an exportable stale dashboard is a data quality incident, not normal variance.",
        },
        {
          id: "rat-use-old",
          text: "Old data can still mislead if it is presented as current in a decision setting.",
        },
        {
          id: "rat-force-run",
          text: "Forcing a run before understanding the failure risks publishing another bad snapshot.",
        },
      ],
      correctRationaleId: "rat-stale-incident",
      feedback: {
        perfect:
          "Exactly. You treated the stale dashboard as a quality incident and chose the remediation that protects users first.",
        partial:
          "You recognized some of the urgency, but the best response is to block stale exports and investigate deliberately.",
        wrong:
          "That choice would leave a stale dashboard active or rush a broken fix. Mark it stale and triage the failure first.",
      },
    },
    {
      type: "triage-remediate",
      id: `${lab.id}-scenario-3`,
      title: "Close the definition mismatch",
      description: `A metric built for ${lab.title.toLowerCase()} changed meaning after a silent definition update. Classify the issue and choose the best remediation.`,
      evidence: [
        {
          type: "change note",
          content:
            "A developer updated the logic but skipped the metric change log because the SQL still passed tests.",
        },
        {
          type: "report impact",
          content:
            "Three reports now disagree on the same KPI definition for the current month.",
        },
        {
          type: "owner feedback",
          content: `The ${stakeholder} wants a correction, a root-cause note, and a safer handoff next time.`,
        },
      ],
      classifications: [
        {
          id: "data-quality-incident",
          label: "Data Quality Incident",
          description: "The source data itself is malformed.",
        },
        {
          id: "logic-design-issue",
          label: "Logic or Design Issue",
          description:
            "A definition or modeling change broke consistency across reports.",
        },
        {
          id: "expected-business-variance",
          label: "Expected Business Variance",
          description: "The KPI changed because the business changed.",
        },
      ],
      correctClassificationId: "logic-design-issue",
      remediations: [
        {
          id: "remediate-backfill-doc",
          label:
            "Correct the definition, backfill affected reports, and add release notes plus review rules.",
          description: "Fixes the current mismatch and reduces future drift.",
        },
        {
          id: "remediate-new-metric",
          label:
            "Create a new metric name and leave the old reports unchanged.",
          description:
            "Avoids backfill but leaves conflicting history in place.",
        },
        {
          id: "remediate-accept",
          label: "Accept the change because automated tests passed.",
          description: "Treats consistency gaps as acceptable noise.",
        },
      ],
      correctRemediationId: "remediate-backfill-doc",
      rationales: [
        {
          id: "rat-definition",
          text: "Conflicting KPI definitions across reports are a logic and governance issue that require correction plus documentation.",
        },
        {
          id: "rat-new-metric",
          text: "A new name alone does not resolve already shared reporting conflicts.",
        },
        {
          id: "rat-tests",
          text: "Passing tests do not guarantee the business definition remained aligned.",
        },
      ],
      correctRationaleId: "rat-definition",
      feedback: {
        perfect:
          "Well done. You treated the mismatch as a definition issue and chose a remediation that restores trust in the reporting layer.",
        partial:
          "You moved toward a fix, but the safest answer also accounts for backfill and clearer change management.",
        wrong:
          "That response leaves conflicting definitions active. This should be triaged as a logic issue and corrected end-to-end.",
      },
    },
  ];
}

function buildScenarios(lab, spec, rendererType, seed) {
  if (rendererType === "action-rationale") {
    return buildActionScenarios(lab, spec, seed);
  }
  if (rendererType === "toggle-config") {
    return buildToggleScenarios(lab, spec, seed);
  }
  if (rendererType === "investigate-decide") {
    return buildInvestigateScenarios(lab, spec, seed);
  }
  return buildTriageScenarios(lab, spec, seed);
}

const generatedLabs = [];
let sortOrder = 1;

for (const spec of specs) {
  spec.labs.forEach(([id, title], index) => {
    const rendererType = renderers[(sortOrder - 1) % renderers.length];
    const difficulty = difficultyFor(index, spec.labs.length);
    const tier = tierFor(index, spec.labs.length);
    const accessLevel = index < spec.freeCount ? "free" : "premium";
    const previousLabId = index > 0 ? spec.labs[index - 1][0] : null;

    const manifest = LabManifestSchema.parse({
      schemaVersion: SCHEMA_VERSION,
      id,
      version: 1,
      title,
      tier,
      track: spec.title,
      difficulty,
      accessLevel,
      tags: buildTags(spec, id, rendererType),
      description: `Practice ${title.toLowerCase()} inside a realistic analytics workflow, choose the safest decision, and explain why it is the most trustworthy SQL or data move.`,
      estimatedMinutes: minutesFor(difficulty),
      learningObjectives: buildObjectives(spec, title),
      sortOrder,
      status: "published",
      prerequisites: previousLabId
        ? [{ labId: previousLabId, minScore: 60 }]
        : [],
      rendererType,
      scenarios: buildScenarios({ id, title }, spec, rendererType, sortOrder),
      hints: buildHints(title),
      scoring,
      careerInsight: `${spec.careerInsight} ${title} is a common scenario in interviews, production reviews, and cross-functional planning.`,
      toolRelevance: spec.toolRelevance,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    generatedLabs.push({
      id,
      constName: `${camel(id)}Lab`,
      manifest,
    });
    sortOrder += 1;
  });
}

const freeCount = generatedLabs.filter(
  (lab) => lab.manifest.accessLevel === "free"
).length;
const premiumCount = generatedLabs.filter(
  (lab) => lab.manifest.accessLevel === "premium"
).length;

if (generatedLabs.length !== 100) {
  throw new Error(`Expected 100 labs, generated ${generatedLabs.length}.`);
}
if (freeCount !== 66 || premiumCount !== 34) {
  throw new Error(
    `Expected 66 free / 34 premium labs, got ${freeCount} / ${premiumCount}.`
  );
}

rmSync(labsDir, { recursive: true, force: true });
mkdirSync(labsDir, { recursive: true });

for (const lab of generatedLabs) {
  writeFileSync(
    path.join(labsDir, `${lab.id}.ts`),
    `import { LabManifestSchema, type LabManifest } from "../../types/manifest";\n\nexport const ${lab.constName}: LabManifest = LabManifestSchema.parse(${JSON.stringify(lab.manifest, null, 2)});\n`
  );
}

writeFileSync(
  catalogPath,
  `// ============================================================\n// DataForge — Lab Catalog\n// Generated by scripts/generate-dataforge-content.mjs\n// ============================================================\n\nimport type { LabManifest } from "../types/manifest";\n${generatedLabs
    .map((lab) => `import { ${lab.constName} } from "./labs/${lab.id}";`)
    .join("\n")}\n\nexport const labCatalog: LabManifest[] = [\n${generatedLabs
    .map((lab) => `  ${lab.constName},`)
    .join("\n")}\n].sort((a, b) => a.sortOrder - b.sortOrder);\n`
);

writeFileSync(
  pathsPath,
  `// ============================================================\n// DataForge — Learning Paths\n// Generated by scripts/generate-dataforge-content.mjs\n// ============================================================\n\nexport interface LearningPath {\n  id: string;\n  title: string;\n  name: string;\n  description: string;\n  targetAudience: string;\n  labIds: string[];\n  icon: string;\n}\n\nexport const learningPaths: LearningPath[] = ${JSON.stringify(
    specs.map((spec) => ({
      id: spec.id,
      title: spec.title,
      name: spec.name,
      description: spec.description,
      targetAudience: spec.targetAudience,
      labIds: spec.labs.map(([id]) => id),
      icon: spec.icon,
    })),
    null,
    2
  )};\n`
);

console.log(`Generated ${generatedLabs.length} DataForge labs.`);
