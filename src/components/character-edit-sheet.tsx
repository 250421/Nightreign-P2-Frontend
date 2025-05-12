import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Edit } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { editCharacterSchema } from "@/features/auth/schemas/edit-character-schema"
import type { Character } from "@/models/character"
import { useEditCharacter } from "@/features/auth/hooks/use-edit-character"

export const CharacterEditSheet = (chara: Character) => {
    const form = useForm<z.infer<typeof editCharacterSchema>>({
        defaultValues: {
            character_id: chara.character_id,
            name: chara.name,
            origin: chara.origin,
            image: chara.characterImageUrl,
        },
    })

    const [open, setOpen] = useState(false)
    const { mutate: editCharacter } = useEditCharacter()

    function onSubmit(data: z.infer<typeof editCharacterSchema>) {
        console.log(data);
        editCharacter(data);
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="bg-yellow-500">
                    <Edit/>
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-screen h-2/3">
                <SheetHeader>
                    <SheetTitle>Edit {chara.name}</SheetTitle>
                    <SheetDescription>
                        Edit character name, origin, and image URL:
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mx-20 my-5">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Batman" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter character name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="origin"
                            render={({ field }) => (
                                <FormItem className="mx-20 my-5">
                                    <FormLabel>Origin</FormLabel>
                                    <FormControl>
                                        <Input placeholder="DC" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter character origin.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="mx-20 my-5">
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Enter image URL (optional).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" className="mx-10 bg-yellow-600">Save</Button>
                        </SheetFooter>
                    </form>
                </Form >
            </SheetContent>
        </Sheet>

    )
}
