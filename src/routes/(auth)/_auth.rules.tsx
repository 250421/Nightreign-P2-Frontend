import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute('/(auth)/_auth/rules')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center h-screen">
      <Card className="md:w-1/2 lg:w-1/2">
        <CardHeader className="text-center text-3xl">
          <CardTitle>HOW TO PLAY</CardTitle>
          <Separator className="my-4" />
        </CardHeader>
        <CardContent>
          <ol>
            <h1 className="text-2xl font-bold">1. Join/Create a Lobby</h1>
            <ol className="list-disc list-inside mx-4">
              <li>To begin, you will navigate to the home screen where a list of lobbies will be displayed.</li>
              <li>If a lobby is waiting for a player, there will be an option to join.</li>
              <li>If no lobbies are available, you can create a new lobby by clicking on the "Create Lobby" button.</li>
              <li>Once you create a lobby, you will wait for another player to join your lobby.</li>
              <li>Once there are two players in a lobby, team selection begins!</li>
            </ol>
            <h1 className="text-2xl font-bold mt-4">2. Choose Your Team</h1>
            <ol className="list-disc list-inside mx-4">
              <li>Once the game begins, you will be prompted to choose three characters.</li>
              <li>Once you have chosen your team, press the "Ready" button on the screen.</li>
              <li>Once both players are ready, the game will begin.</li>
            </ol>
            <h1 className="text-2xl font-bold mt-4">3. Battle!</h1>
            <ol className="list-disc list-inside mx-4">
              <li>Battle begins with both players selecting their first character.</li>
              <li>Once both players have selected a character, the characters fight!</li>
              <li>The winner of the fight is determined by non-partial AI, which will show which character won and why.</li>
              <li>The player whose character was defeated must now select their next character to use, and battle continues.</li>
              <li>A player wins by defeating all three of their opponent's characters!</li>
            </ol>
          </ol>

        </CardContent>
      </Card>
    </div>
  )
}
