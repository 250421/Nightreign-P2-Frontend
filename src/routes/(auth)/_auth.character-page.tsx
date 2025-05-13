import { CharacterCreateSheet } from '@/components/character-create-sheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useGetCharacters } from '@/hooks/use-get-characters';
import { cn } from '@/lib/utils';
import { createFileRoute} from '@tanstack/react-router'
import { Trash } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useConfirm } from '@/hooks/use-confirm';
import { useDeleteCharacter } from '@/features/auth/hooks/use-delete-character';
import { CharacterEditSheet } from '@/components/character-edit-sheet';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/(auth)/_auth/character-page')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: characters } = useGetCharacters();
  const { data: user } = useAuth();
  const [searchInput, updateSearchInput] = useState<string>("");

  const [deletionConfirm, DeletionDialog] = useConfirm();

  const { mutate: confirmDelete } = useDeleteCharacter();

  const handleDelete = async (deleteId: number) => {
    const ok = await deletionConfirm();
    if (!ok) return;

    //console.log("Deleting character with id: ", deleteId);
    confirmDelete({ id: deleteId.toString() });
  }

  if (!characters || characters.length === 0) {
    return (
      <div>
        {user?.role === "ADMIN" &&
          <div>
            <h1 className="flex flex-col items-center">
              <CharacterCreateSheet />
            </h1>
            <Separator className="my-4 w-full" />
          </div>
        }
        <h1>No characters found</h1>
      </div>
    )
  }
  else {
    //console.log(characters);
  }
  return (
    <div>
      {user?.role === "ADMIN" &&
        <div>
          <h1 className="flex flex-col items-center">
            <CharacterCreateSheet />
          </h1>
          <Separator className="my-4 w-full" />
        </div>
      }
      <h1>
        <Input 
          placeholder="Search" 
          className='bg-gray-100' 
          onChange={(event) => updateSearchInput(event.target.value)}/>
      </h1>
      <div
        className={cn("grid gap-y-10 grid-cols-3 my-10")}
      >

        {characters
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(chara => chara.name.toLowerCase().includes(searchInput))
        .map((chara) => {
          return (
            <Card key={chara.character_id} className="w-[400px] h-[200px]">
              <div className="flex justify-between">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-nowrap">{chara.name}</CardTitle>
                  <CardDescription className="text-nowrap">{chara.origin}</CardDescription>
                  {user?.role === "ADMIN" && (
                    <div className="flex flex-cols gap-x-2">
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(chara.character_id);
                        }}
                      >
                        <Trash />
                      </Button>
                      <CharacterEditSheet {...chara} />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="w-40 h-40">
                  <img src={chara.characterImageUrl} alt={chara.name} className="w-full h-full object-contain" />
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      <DeletionDialog
        title={"Delete Character"}
        description={"Are you sure you want to delete this character?"}
        destructive={true}
      />
    </div>
  )
}
