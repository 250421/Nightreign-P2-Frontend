import { z } from "zod"

export const addCharacterSchema = z.object({
    character_id: z.null(),
    name: z.string().min(1, {
        message: "Name must not be empty.",
    }),
    origin: z.string().min(1, {
        message: "Origin must not be empty.",
    }),
    image: z.string().optional(),
})

export type AddCharacterSchemaType = z.infer<typeof addCharacterSchema>;