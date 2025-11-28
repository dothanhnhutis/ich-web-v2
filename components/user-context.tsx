"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { currentUserAction } from "@/data/user/currentUserAction";
import { logoutAction } from "@/data/user/logoutAction";
import type { UserDetailWithoutPassword } from "@/types/summary-types";

type UserContextProps = {
  user?: UserDetailWithoutPassword | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  handleLogout: () => Promise<void>;
};

const UserContext = React.createContext<UserContextProps | null>(null);

export function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContext.");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: user, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: currentUserAction,
  });

  const permissions = React.useMemo(() => {
    return user
      ? Array.from(new Set(user.roles.flatMap((r) => r.permissions)))
      : [];
  }, [user]);

  const hasPermission = React.useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  const handleLogout = React.useCallback(async () => {
    await logoutAction();
    router.push("/login");
  }, [router]);

  const contextValue = React.useMemo<UserContextProps>(
    () => ({
      user,
      loading: isPending,
      permissions,
      hasPermission,
      handleLogout,
    }),
    [user, isPending, permissions, hasPermission, handleLogout]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
