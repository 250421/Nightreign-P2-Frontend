import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCharacters } from '@/hooks/use-get-characters';
import { cn } from '@/lib/utils';
import type { Character } from '@/models/character';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/character-page')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: characters } = useGetCharacters();

  if (!characters || characters.length === 0) {
    return <h1>No characters found</h1>;
  }
  else{
    console.log(characters);
  }
  return (
    <div
      className={cn("grid gap-y-10")}
    >
      {characters.map((chara) => (
        <Link
          key={chara.id}
          to={"/character-page"}
          params={{
            restaurantId: chara.id.toString(),
          }}
        >
          <h1>Text</h1>
        </Link>
      ))}
    </div>
  )
}
