import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookiesList = await cookies();

  return (
    <SidebarProvider
      defaultOpen={cookiesList.get("sidebar_state")?.value === "true"}
    >
      <AdminSidebar />
      <SidebarInset className="block w-[calc(100%_-_var(--sidebar-width))]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
