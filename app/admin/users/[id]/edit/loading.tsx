import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
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
              <BreadcrumbPage className="text-muted-foreground">
                Người dùng & vai trò
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden xs:block">
              <BreadcrumbLink href="/admin/users">Người dùng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden xs:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Cập nhật người dùng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-4 w-full max-w-3xl mx-auto">
        <FieldSet>
          <div className="space-y-2">
            <Skeleton className="w-30 h-4" />
            <Skeleton className="w-50 h-3" />
          </div>

          <FieldGroup>
            <Field>
              <div className="space-y-2">
                <Skeleton className="w-30 h-3" />
                <div className="flex gap-2">
                  <Skeleton className="size-14 rounded-full" />
                  <div className="space-y-2 py-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-40 h-3" />
                  </div>
                </div>
              </div>
            </Field>
            <div className="grid items-center gap-4 sm:grid-cols-[7fr_3fr]">
              <Field>
                <div>
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className=" h-9" />
              </Field>
              <Field>
                <div>
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className=" h-9" />
              </Field>
            </div>
            <Field>
              <div className="space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-50 h-3" />
              </div>
              <div className="flex flex-col gap-2 px-4">
                <div className="flex items-center py-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-50 h-2" />
                  </div>
                  <Skeleton className="w-[32px] h-[18px] shrink-0" />
                </div>
                <div className="flex items-center py-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-50 h-2" />
                  </div>
                  <Skeleton className="w-[32px] h-[18px] shrink-0" />
                </div>
                <div className="flex items-center py-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-50 h-2" />
                  </div>
                  <Skeleton className="w-[32px] h-[18px] shrink-0" />
                </div>
                <div className="flex items-center py-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-50 h-2" />
                  </div>
                  <Skeleton className="w-[32px] h-[18px] shrink-0" />
                </div>
              </div>
            </Field>

            <Field orientation="horizontal" className="justify-end">
              <Skeleton className="w-[60px] h-9" />
              <Skeleton className="w-[100px] h-9" />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </>
  );
};

export default LoadingPage;
