import { Navbar } from '@/components/shared/navbar/navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/_auth')({
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div>
            <Navbar />
            <main className="max-w-screen mx-auto w-11/12 my-10">
                <Outlet />
            </main>
        </div>
    )
}
