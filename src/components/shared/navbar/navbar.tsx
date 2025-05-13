import { NavbarNavigation } from "./navbar-navigation"
import { UserDropdown } from "./user-dropdown"

export const Navbar = () => {
    return (
        <nav className="py-4 bg-gray-800 border-b">
            <div className="flex justify-between max-w-screen mx-auto w-11/12">
                <div className="flex justify-between items-center gap-x-5">
                    <h1 className=" font-bold text-2xl text-red-800">Battle Simulator</h1>
                    <div className="mx-10">
                        <NavbarNavigation />
                    </div>
                </div>

                <div>
                    <UserDropdown />
                </div>
            </div>
        </nav>
    )
}
