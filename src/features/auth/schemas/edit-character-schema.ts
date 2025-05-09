import { z } from "zod"

export const editCharacterSchema = z.object({
    character_id: z.number(),
    name: z.string().min(1, {
        message: "Name must not be empty.",
    }),
    origin: z.string().min(1, {
        message: "Origin must not be empty.",
    }),
    image: z.string().optional(),
})

export type EditCharacterSchemaType = z.infer<typeof editCharacterSchema>;