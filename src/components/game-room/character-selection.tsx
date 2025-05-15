import { useGetCharacters } from "@/hooks/use-get-characters";
import type { Character } from "@/models/character";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Check, Ellipsis } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


export const CharacterSelection = () => {
    // character select
      const { data: characters } = useGetCharacters();
      const [characterSelect, updateSelectedCharacter] = useState<Character[]>();
      const [searchInput, updateSearchInput] = useState<string>("");
      const [p2ready, p2setReady] = useState(false);
      const [ready, setReady] = useState(false);
    
      const addToEnd = (newChara: Character) => {
        updateSelectedCharacter(prevList => [...prevList ? prevList : [], newChara]);
      }
    
      const removeCharacter = (charaToDelete: Character) => {
        updateSelectedCharacter(characterSelect?.filter(chara => chara !== charaToDelete));
      }
    
      const removeFirst = () => {
        updateSelectedCharacter(characterSelect?.filter(chara => chara !== characterSelect.at(0)));
      }
      
      if(!characters || characters.length == 0){
        return(
          <div>No characters found</div>
        )
      }
      else {
    return (
        <main>
          <h1 className='flex justify-center text-5xl font-bold'>
            Select your team!
          </h1>
          <Card className={`fixed left-9/10 bottom-2/3 w-40 text-center flex flex-row justify-center ${p2ready ? "bg-green-400" : "bg-yellow-300"}`}>
            <p>Player 2</p>
            {p2ready ? <Check /> : <Ellipsis />}
          </Card>
          <h2 className="my-10">
            <Input
              placeholder="Search"
              className='bg-gray-100'
              onChange={(event) => updateSearchInput(event.target.value)} />
          </h2>
          <div className={cn("grid gap-y-10 grid-cols-3 pb-100 my-10")}>
            {characters
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter(chara => chara.name.toLowerCase().includes(searchInput))
              .map((chara) => {
                return (
                  <Card key={chara.character_id}
                    className="w-[400px] h-[200px] cursor-pointer"
                    onClick={() => {
                      console.log(chara);
                      if (characterSelect?.includes(chara)) {
                        // "deselect character" by removing it
                        removeCharacter(chara);
                      }
                      else if (characterSelect?.length == 3) {
                        // Remove first selected and add the new one as third
                        removeFirst();
                        addToEnd(chara);
                      }
                      else {
                        addToEnd(chara);
                      }
                    }}>
                    <div className="flex justify-between">
                      <CardHeader>
                        <CardTitle className="text-3xl font-bold text-wrap">{chara.name}</CardTitle>
                        <CardDescription className="text-wrap">{chara.origin}</CardDescription>
                      </CardHeader>
                      <CardContent className="w-40 h-40">
                        <img src={chara.characterImageUrl} alt={chara.name} className=" w-full h-full object-contain" />
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
          </div>
          <div className="fixed bottom-0 right-0 left-0 mx-5">
            <Card>
              <div className="flex flex-row gap-x-50 justify-center">
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(0)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+1"}
                    alt={characterSelect?.at(0)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(1)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+2"}
                    alt={characterSelect?.at(1)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
                <Card className="w-50 h-50">
                  <img
                    src={characterSelect?.at(2)?.characterImageUrl || "https://placehold.co/600x400/transparent/black?text=Character+3"}
                    alt={characterSelect?.at(2)?.name || "Placeholder"}
                    className="w-full h-full object-contain"
                  />
                </Card>
              </div>
              <footer className="flex flex-row justify-center w-full">
                <Button className={`${ready ? 'bg-red-500' : 'bg-green-500'} w-1/2 self-center justify-items-center`} disabled={characterSelect?.length !== 3} onClick={() => {
                  setReady(!ready);
                  console.log(ready);
                }}>
                  {ready ? "Cancel" : "Ready"}
                </Button>
              </footer>
            </Card>
          </div>
        </main>
        
    )
  }
}