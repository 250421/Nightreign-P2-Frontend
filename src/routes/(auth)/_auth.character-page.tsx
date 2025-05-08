import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/character-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/_auth/character-page"!</div>
}
