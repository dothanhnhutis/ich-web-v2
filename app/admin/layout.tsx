import { ThemeProvider } from "next-themes";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/components/user-context";
import { AdminSidebar } from "./admin-sidebar";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <UserProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="block w-[calc(100%_-_var(--sidebar-width))]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
};

export default AdminLayout;
