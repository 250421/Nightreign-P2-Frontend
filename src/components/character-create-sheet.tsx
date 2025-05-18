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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAddCharacter } from "@/features/auth/hooks/use-add-character"
import type { addCharacterSchema } from "@/features/auth/schemas/add-character-schema"

export const CharacterCreateSheet = () => {
    const form = useForm<z.infer<typeof addCharacterSchema>>({
        defaultValues: {
            character_id: null,
            name: "",
            origin: "",
            image: "",
        },
    })

    const [open, setOpen] = useState(false)
    const { mutate: addCharacter } = useAddCharacter()

    function onSubmit(data: z.infer<typeof addCharacterSchema>) {
        //console.log(data);
        addCharacter(data);
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="bg-green-500">
                    <Plus />
                    Add New Character
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="w-screen h-2/3">
                <SheetHeader>
                    <SheetTitle>Add a new character!</SheetTitle>
                    <SheetDescription>
                        Add a character name, origin, and image URL to create a new character:
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
                            <Button type="submit" className="mx-10 bg-green-600">Add Character</Button>
                        </SheetFooter>
                    </form>
                </Form >
            </SheetContent>
        </Sheet>

    )
}
