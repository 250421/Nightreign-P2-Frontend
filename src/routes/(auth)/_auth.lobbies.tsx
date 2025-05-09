import LobbyTable from '@/components/data-table/lobby-table'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/lobbies')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <LobbyTable />
    </div>
  )
}
