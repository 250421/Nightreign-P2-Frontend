import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfile } from "./user-profile";
import { useConfirm } from "@/hooks/use-confirm";
import { useSignOut } from "@/hooks/use-sign-out";
import { LogOut } from "lucide-react";

export const UserDropdown = () => {
    const [logOutConfirm, LogOutDialog] = useConfirm();

    const { mutate: signOut } = useSignOut();

    const handleLogout = async () => {
        const ok = await logOutConfirm();
        if (!ok) return;

        signOut();
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserProfile />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="size=4  mr-2"/>
                            Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogOutDialog
                title={"Log Out"}
                description={"Are you sure you want to log out?"}
                destructive={true}
            />
        </div>
    );
};