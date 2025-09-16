import {z} from "zod";

export const messageSchema = z.object({
    content : z
    .string()
    .min(10, "Message content must be at least 10 characters long")
    .max(300, "Message content is too long"),
}) 