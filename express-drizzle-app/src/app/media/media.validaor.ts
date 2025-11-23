import z from "zod";
import { nonemptyString } from "../../lib/zod/zod-schemas";

const ContextTypeSchema = z.enum(["user-profile-images", "product-images"])

export const fileUploadSchema = z.object({
    base64: nonemptyString,
    fileName: nonemptyString,
    contextType: ContextTypeSchema,
    contextId: nonemptyString
}).strict()

export type FileUpload = z.infer<typeof fileUploadSchema>
export type ContextType = z.infer<typeof ContextTypeSchema>
