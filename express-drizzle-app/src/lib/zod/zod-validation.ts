import { ZodSchema } from "zod";

export const validateSchema = async (schema: ZodSchema, value: any) => {

    const result = await schema.safeParseAsync(value);

    if (!result.success) {

        const errorMessages = result.error.errors.map(
            (err) => `${err.path.join('.')}: ${err.message}`
        ).join('; ');

        return { success: false, errorMessages }
    }

    return { success: true, errorMessages: "Validation passed!" };

}