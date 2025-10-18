"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { currentUserAction, logoutAction, type UserDetail } from "@/data/user";

type UserContextProps = {
  user: UserDetail | null;
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

  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<UserDetail | null>(null);

  React.useEffect(() => {
    async function fetchUser() {
      const user = await currentUserAction();
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, []);

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
      loading,
      permissions,
      hasPermission,
      handleLogout,
    }),
    [user, loading, permissions, hasPermission, handleLogout]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
