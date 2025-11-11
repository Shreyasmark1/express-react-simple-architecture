import { z } from "zod";

export const emailSchema = z.string({ message: "Invalid Email" }).email({ message: "Invalid email" });
export const mobileNoSchema = z.string({ message: "Invalid mobile number" });
export const optionalString = z.string().optional().nullable();
export const imageSchema = z.object({ url: z.string().nonempty() }).strict()
