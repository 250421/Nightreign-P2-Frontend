import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCharacters } from '@/hooks/use-get-characters';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/character-page')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: characters } = useGetCharacters();

  if (!characters || characters.length === 0) {
    return <h1>No characters found</h1>;
  }
  else {
    console.log(characters);
  }
  return (
    <div
      className={cn("grid gap-y-10 grid-cols-3")}
    >
      {characters.map((chara) => (
        <Link
          key={chara.id}
          to={"/character-page"}
          params={{
            restaurantId: chara.id,
          }}
        >
          <Card className="w-5/6">
            <div className="flex justify-between">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-nowrap">{chara.name}</CardTitle>
                <CardDescription className="text-nowrap">{chara.origin}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={chara.image} alt={chara.name} className="w-full h-auto" />
              </CardContent>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
