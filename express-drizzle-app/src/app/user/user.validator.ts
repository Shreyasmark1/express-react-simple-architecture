import z from "zod";
import { imageSchema, optionalString, emailSchema } from "../../lib/zod/zod-schemas";

export const userUpdateBody = z.object({
    username: z.string().nonempty(),
    userImage: imageSchema.optional().nullable(),
    email: emailSchema,
    publicId: optionalString // ideally not optional
}).strict();

export type UserUpdate = z.infer<typeof userUpdateBody>

export const UserValidators = {
    update: userUpdateBody
}