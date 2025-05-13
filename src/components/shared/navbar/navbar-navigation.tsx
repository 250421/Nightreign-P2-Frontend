import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

export const NavbarNavigation = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-x-3">
                <NavigationMenuItem>
                        <NavigationMenuLink href="/" className="bg-red-800">
                            Home
                        </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                        <NavigationMenuLink href="/lobbies" className="bg-red-800">
                            Lobbies
                        </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                        <NavigationMenuLink href="/rules" className="bg-red-800">
                            Rules
                        </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                        <NavigationMenuLink href="/character-page" className="bg-red-800">
                            Characters
                        </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}