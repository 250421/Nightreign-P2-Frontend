import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/dashboard"!</div>
}
