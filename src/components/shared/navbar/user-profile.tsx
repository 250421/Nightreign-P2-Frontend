import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const UserProfile = () => {
  const { data: user } = useAuth();

  const getInitials = (name: string) => {
    return (name[0] + name[1]).toUpperCase();
  };

  return (
    <Avatar>
      <AvatarFallback>{getInitials(user?.username ?? "??")}</AvatarFallback>
    </Avatar>
  );
};
