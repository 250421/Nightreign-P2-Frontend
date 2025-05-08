import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Link } from "@tanstack/react-router"

export const NavbarNavigation = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-x-3">
                <NavigationMenuItem>
                    <Link to={"/dashboard"}>
                        <NavigationMenuLink className="bg-red-800">
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link to={"/lobbies"}>
                        <NavigationMenuLink className="bg-red-800">
                            Lobbies
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link to={"/rules"}>
                        <NavigationMenuLink className="bg-red-800">
                            Rules
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <Link to={"/character-page"}>
                        <NavigationMenuLink className="bg-red-800">
                            Characters
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}