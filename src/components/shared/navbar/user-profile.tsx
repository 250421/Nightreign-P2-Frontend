import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/features/auth/hooks/use-auth";


export const UserProfile = () => {
    const { data: user } = useAuth();

    const getInitials = (name: string) => {
        if (!name || name.length === 0) return "U"; // Default for empty username

        if (name.length === 1) {
            // For single character names, duplicate the character
            return name[0].toUpperCase();
        }

        // For names with 2+ characters, use first two
        return (name[0] + name[1]).toUpperCase();
    };

    return (
        <Avatar>
            <AvatarFallback>{getInitials(user?.username ?? "")}</AvatarFallback>
        </Avatar>
    );
};
