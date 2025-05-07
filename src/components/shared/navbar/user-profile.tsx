import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/use-auth';


export const UserProfile = () => {
    const { data: user } = useAuth();

    const getInitials = (name: string) => {
        return (name[0] + name[1]).toUpperCase();
    };

    return (
        <Avatar>
            <AvatarFallback>{"NO"/*getInitials(user?.username ?? "")*/}</AvatarFallback>
        </Avatar>
    );
};
