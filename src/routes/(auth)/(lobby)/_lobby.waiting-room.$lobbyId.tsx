import { Button } from '@/components/ui/button'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(auth)/(lobby)/_lobby/waiting-room/$lobbyId')({
  component: RouteComponent,
})

function RouteComponent() {
    const [ready, setReady] = useState(false);

    const { lobbyId } = useParams({
    from: "/(auth)/(lobby)/_lobby/waiting-room/$lobbyId"
  });

  return (
    <div className="gap-y-10">
        <h1>Lobby ID: {lobbyId}</h1>
        <p>Player 1: </p>
        <p>Player 2: </p>
        <p>{ready ? "Waiting for other player... press again to cancel." : "Press the button when you are ready to begin!"}</p>
        <Button className={`${ready ? 'bg-red-500' : 'bg-green-500'} w-1/2`} onClick={() => {
            setReady(!ready);
            console.log(ready);
        }}>
              {ready ? "Cancel" : "Ready"}
        </Button>
    </div>
  )
}
