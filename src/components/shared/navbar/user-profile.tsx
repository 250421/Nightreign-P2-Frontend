import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export const UserProfile = () => {

    const getInitials = (name: string) => {
        return (name[0] + name[1]).toUpperCase();
    };

    return (
        <Avatar>
            <AvatarFallback>{"NO"/*getInitials(user?.username ?? "")*/}</AvatarFallback>
        </Avatar>
    );
};
