import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/components/user-context";
import { currentUserAction } from "@/data/user";
import { permissionRoutes } from "@/routes";
import { AdminSidebar } from "./admin-sidebar";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookiesList = await cookies();
  const headersList = await headers();
  // pathname được thêm ở middleware
  const pathname = headersList.get("x-pathname") || "";
  const user = await currentUserAction();

  if (!user) {
    redirect("/login");
  }

  const permissions: string[] = Array.from(
    new Set(user.roles.flatMap((r) => r.permissions))
  );

  const hasPer = permissions
    .map((p) => permissionRoutes[p] || null)
    .filter((p) => p != null)
    .some((regex) => regex.test(pathname));

  if (!hasPer && pathname !== "/admin") return notFound();

  return (
    <UserProvider>
      <SidebarProvider
        defaultOpen={
          cookiesList.get("sidebar_state")?.value
            ? cookiesList.get("sidebar_state")?.value === "true"
            : true
        }
      >
        <AdminSidebar />
        <SidebarInset className="block w-[calc(100%_-_var(--sidebar-width))]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
};

export default AdminLayout;
