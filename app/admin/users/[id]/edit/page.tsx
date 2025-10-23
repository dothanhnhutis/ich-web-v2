import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getUserDetailAction } from "@/data/user";
import UpdateUserForm from "./form";

export const metadata: Metadata = {
  title: "Tạo Người Dùng",
  robots: {
    index: false,
    follow: false,
  },
};

const UpdateUserPage = async (props: { params: Promise<{ id: string }> }) => {
  const user = await getUserDetailAction((await props.params).id);

  if (!user) notFound();

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
              <BreadcrumbLink href="/admin/warehouses">
                Người dùng & Quyền
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo Người Dùng Mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <UpdateUserForm user={user} />
    </>
  );
};

export default UpdateUserPage;
