import { pgEnum, pgTable, text, uuid, integer } from "drizzle-orm/pg-core";
import { defaultTimestamps, primaryKey } from "../lib/db/pg/util";

export const schedulerContext = pgEnum('scheduler_context', ['on_register', 'on_delete',]);
export const schedulerStatus = pgEnum('scheduler_status', ['scheduled', 'completed', 'failed']);


export const schedulerJobs = pgTable('scheduler_jobs', {
    sjId: primaryKey('sj_id'),
    contextId: uuid('context_id').notNull(),
    jobContext: schedulerContext('job_context').notNull(),
    retryCount: integer('retry_count').default(0).notNull(),
    status: schedulerStatus('job_status').default("scheduled").notNull(),
    errorStack: text('error_stack'),

    ...defaultTimestamps()
});


export const schedulerContextValues = schedulerContext.enumValues;
export type SchedulerContext = typeof schedulerContextValues[number];

const schedulerStatusValues = schedulerStatus.enumValues.map((i) => i);
export type SchedulerStatus = typeof schedulerStatusValues[number]

export type SchedulerJobsSelect = typeof schedulerJobs.$inferSelect
export type SchedulerJobsInsert = typeof schedulerJobs.$inferInsert