import { useGetMeQuery, useLoginMutation } from "@/store/services/auth";
import { type LoginRequest } from "@shared/schema";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user, isLoading, error, refetch } = useGetMeQuery();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const login = async (credentials: LoginRequest) => {
    try {
      const data = await loginMutation(credentials).unwrap();
      localStorage.setItem('auth_token', data.token);
      await refetch();
      toast({
        title: "Xush kelibsiz",
        description: `${data.user.firstName} ${data.user.lastName} sifatida tizimga kirdingiz`,
      });
      if (data.user.roles.includes("ADMIN")) setLocation("/users");
      else if (data.user.roles.includes("PAYMENT")) setLocation("/payments");
      else if (data.user.roles.includes("REPORTS")) setLocation("/reports");
      else setLocation("/");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Kirish muvaffaqiyatsiz tugadi",
        description: err.data?.message || err.message || "Xatolik yuz berdi",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    error,
    login,
    isLoggingIn,
    logout,
  };
}
