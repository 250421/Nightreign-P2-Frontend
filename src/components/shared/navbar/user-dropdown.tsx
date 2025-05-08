import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfile } from "./user-profile";

export const UserDropdown = () => {

    return (
        <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserProfile />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                </DropdownMenuContent>
            </DropdownMenu>
    );
};