"use strict";
// ============================================================
// DataForge — Lab Manifest Schema v1.1
// TypeScript types + Zod runtime validation
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabManifestSchema = exports.PrerequisiteRuleSchema = exports.ScoringConfigSchema = exports.ScenarioSchema = exports.TriageRemediateScenarioSchema = exports.RemediationOptionSchema = exports.ClassificationOptionSchema = exports.EvidenceItemSchema = exports.InvestigateDecideScenarioSchema = exports.InvestigationSourceSchema = exports.ToggleConfigScenarioSchema = exports.ToggleConfigItemSchema = exports.ActionRationaleScenarioSchema = exports.ActionOptionSchema = exports.ScenarioFeedbackSchema = exports.RationaleSchema = exports.DisplayFieldSchema = exports.LabStatusEnum = exports.DifficultyEnum = exports.AccessLevelEnum = exports.RendererTypeEnum = exports.TrackEnum = exports.TierEnum = exports.SCHEMA_VERSION = void 0;
const v4_1 = require("zod/v4");
// --- Schema Versioning ---
exports.SCHEMA_VERSION = "1.1";
// --- Enums ---
exports.TierEnum = v4_1.z.enum(["beginner", "intermediate", "advanced"]);
exports.TrackEnum = v4_1.z.enum([
    "SQL Fundamentals",
    "Database Design",
    "Data Analysis",
    "Data Pipelines",
    "Business Intelligence",
    "Advanced Analytics",
]);
exports.RendererTypeEnum = v4_1.z.enum([
    "action-rationale",
    "toggle-config",
    "investigate-decide",
    "triage-remediate",
]);
exports.AccessLevelEnum = v4_1.z.enum(["free", "premium"]);
exports.DifficultyEnum = v4_1.z.enum(["easy", "moderate", "challenging"]);
exports.LabStatusEnum = v4_1.z.enum(["draft", "published"]);
// --- Shared Elements ---
exports.DisplayFieldSchema = v4_1.z.object({
    label: v4_1.z.string(),
    value: v4_1.z.string(),
    emphasis: v4_1.z.enum(["normal", "warn", "critical"]).optional(),
});
exports.RationaleSchema = v4_1.z.object({
    id: v4_1.z.string(),
    text: v4_1.z.string(),
});
exports.ScenarioFeedbackSchema = v4_1.z.object({
    perfect: v4_1.z.string(),
    partial: v4_1.z.string(),
    wrong: v4_1.z.string(),
});
exports.ActionOptionSchema = v4_1.z.object({
    id: v4_1.z.string(),
    label: v4_1.z.string(),
    color: v4_1.z.enum(["blue", "green", "yellow", "orange", "red"]).optional(),
});
// --- Scenario Types ---
exports.ActionRationaleScenarioSchema = v4_1.z.object({
    type: v4_1.z.literal("action-rationale"),
    id: v4_1.z.string(),
    title: v4_1.z.string().optional(),
    context: v4_1.z.string(),
    displayFields: v4_1.z.array(exports.DisplayFieldSchema).default([]),
    evidence: v4_1.z.array(v4_1.z.string()).optional(),
    logEntry: v4_1.z.string().optional(),
    actions: v4_1.z.array(exports.ActionOptionSchema).min(2).max(5),
    correctActionId: v4_1.z.string(),
    rationales: v4_1.z.array(exports.RationaleSchema).min(2).max(5),
    correctRationaleId: v4_1.z.string(),
    feedback: exports.ScenarioFeedbackSchema,
});
exports.ToggleConfigItemSchema = v4_1.z.object({
    id: v4_1.z.string(),
    label: v4_1.z.string(),
    detail: v4_1.z.string(),
    currentState: v4_1.z.string(),
    correctState: v4_1.z.string(),
    states: v4_1.z.array(v4_1.z.string()).min(2),
    rationaleId: v4_1.z.string(),
});
exports.ToggleConfigScenarioSchema = v4_1.z.object({
    type: v4_1.z.literal("toggle-config"),
    id: v4_1.z.string(),
    title: v4_1.z.string(),
    description: v4_1.z.string(),
    targetSystem: v4_1.z.string(),
    items: v4_1.z.array(exports.ToggleConfigItemSchema).min(2),
    rationales: v4_1.z.array(exports.RationaleSchema).min(1),
    feedback: exports.ScenarioFeedbackSchema,
});
exports.InvestigationSourceSchema = v4_1.z.object({
    id: v4_1.z.string(),
    label: v4_1.z.string(),
    content: v4_1.z.string(),
    isCritical: v4_1.z.boolean().optional(),
});
exports.InvestigateDecideScenarioSchema = v4_1.z.object({
    type: v4_1.z.literal("investigate-decide"),
    id: v4_1.z.string(),
    title: v4_1.z.string(),
    objective: v4_1.z.string(),
    investigationData: v4_1.z.array(exports.InvestigationSourceSchema).min(2),
    actions: v4_1.z.array(exports.ActionOptionSchema).min(2).max(5),
    correctActionId: v4_1.z.string(),
    rationales: v4_1.z.array(exports.RationaleSchema).min(2).max(5),
    correctRationaleId: v4_1.z.string(),
    feedback: exports.ScenarioFeedbackSchema,
});
exports.EvidenceItemSchema = v4_1.z.object({
    type: v4_1.z.string(),
    content: v4_1.z.string(),
    icon: v4_1.z.string().optional(),
});
exports.ClassificationOptionSchema = v4_1.z.object({
    id: v4_1.z.string(),
    label: v4_1.z.string(),
    description: v4_1.z.string(),
});
exports.RemediationOptionSchema = v4_1.z.object({
    id: v4_1.z.string(),
    label: v4_1.z.string(),
    description: v4_1.z.string(),
});
exports.TriageRemediateScenarioSchema = v4_1.z.object({
    type: v4_1.z.literal("triage-remediate"),
    id: v4_1.z.string(),
    title: v4_1.z.string(),
    description: v4_1.z.string(),
    evidence: v4_1.z.array(exports.EvidenceItemSchema).min(1),
    classifications: v4_1.z.array(exports.ClassificationOptionSchema).min(2),
    correctClassificationId: v4_1.z.string(),
    remediations: v4_1.z.array(exports.RemediationOptionSchema).min(2),
    correctRemediationId: v4_1.z.string(),
    rationales: v4_1.z.array(exports.RationaleSchema).min(2),
    correctRationaleId: v4_1.z.string(),
    feedback: exports.ScenarioFeedbackSchema,
});
// --- Discriminated Union ---
exports.ScenarioSchema = v4_1.z.discriminatedUnion("type", [
    exports.ActionRationaleScenarioSchema,
    exports.ToggleConfigScenarioSchema,
    exports.InvestigateDecideScenarioSchema,
    exports.TriageRemediateScenarioSchema,
]);
// --- Scoring ---
exports.ScoringConfigSchema = v4_1.z.object({
    maxScore: v4_1.z.literal(100),
    hintPenalty: v4_1.z.number().min(1).max(20),
    penalties: v4_1.z.object({
        perfect: v4_1.z.literal(0),
        partial: v4_1.z.number().min(1).max(50),
        wrong: v4_1.z.number().min(1).max(50),
    }),
    passingThresholds: v4_1.z.object({
        pass: v4_1.z.number().min(50).max(100),
        partial: v4_1.z.number().min(20).max(80),
    }),
});
// --- Prerequisites ---
exports.PrerequisiteRuleSchema = v4_1.z.object({
    labId: v4_1.z.string(),
    minScore: v4_1.z.number().optional(),
});
// --- Lab Manifest ---
exports.LabManifestSchema = v4_1.z.object({
    schemaVersion: v4_1.z.literal(exports.SCHEMA_VERSION),
    id: v4_1.z.string(),
    version: v4_1.z.number().int().min(1),
    title: v4_1.z.string().min(3).max(80),
    tier: exports.TierEnum,
    track: exports.TrackEnum,
    difficulty: exports.DifficultyEnum,
    accessLevel: exports.AccessLevelEnum,
    tags: v4_1.z.array(v4_1.z.string()),
    description: v4_1.z.string().min(10).max(300),
    estimatedMinutes: v4_1.z.number().min(1).max(60),
    learningObjectives: v4_1.z.array(v4_1.z.string()).min(3).max(7),
    sortOrder: v4_1.z.number().int(),
    status: exports.LabStatusEnum,
    prerequisites: v4_1.z.array(exports.PrerequisiteRuleSchema),
    rendererType: exports.RendererTypeEnum,
    scenarios: v4_1.z.array(exports.ScenarioSchema).min(3).max(5),
    hints: v4_1.z.tuple([v4_1.z.string(), v4_1.z.string(), v4_1.z.string()]),
    scoring: exports.ScoringConfigSchema,
    careerInsight: v4_1.z.string(),
    toolRelevance: v4_1.z.array(v4_1.z.string()).min(1),
    createdAt: v4_1.z.string(),
    updatedAt: v4_1.z.string(),
});
