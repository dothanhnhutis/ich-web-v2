import { PlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import RoleTable from "./table-data";
export const metadata: Metadata = {
  title: "Kho Hàng",
  robots: {
    index: false,
    follow: false,
  },
};
const RolesPage = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;

  if (Object.keys(searchParams).length === 0)
    redirect(`/admin/roles?limit=10&page=1`);

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
              <BreadcrumbPage>Vai Trò</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="w-full overflow-hidden">
        <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="text-2xl font-bold shrink-0">Quản vai trò </h3>
            <Link
              href="/admin/roles/create"
              className={cn(buttonVariants({ variant: "link" }))}
            >
              <span className="hidden xs:inline">Tạo vai trò mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          </div>

          <RoleTable />
        </div>
      </div>
    </>
  );
};

export default RolesPage;
