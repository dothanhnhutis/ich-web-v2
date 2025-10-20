import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserTable from "./table-data";

export const metadata: Metadata = {
  title: "Quản Lý Người Dùng",
  robots: {
    index: false,
    follow: false,
  },
};
const UsersPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  if (Object.keys(searchParams).length === 0)
    redirect(`/admin/users?limit=10&page=1`);

  // if (searchParams.has("email") && searchParams.has("username")) {
  //   let lastKey: string;
  //   for (const [key] of Array.from(searchParams.entries()).reverse()) {
  //     if (key === "email" || key === "username") {
  //       lastKey = key;
  //       break;
  //     }
  //   }
  // }

  return (
    <>
      <header className="sticky top-0 right-0 z-50 bg-background/10 backdrop-blur-lg flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Chức Năng Chính</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="text-muted-foreground">
                Người Dùng & Vai Trò
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Người Dùng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <UserTable />
    </>
  );
};

export default UsersPage;
