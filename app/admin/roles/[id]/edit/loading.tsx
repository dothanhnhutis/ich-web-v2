import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
              <BreadcrumbLink href="/admin/roles">Vai trò</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden xs:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Cập nhật vai trò</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-4 w-full max-w-3xl mx-auto">
        <FieldSet>
          <FieldLegend>
            <Skeleton className="w-30 h-4" />
          </FieldLegend>
          <Skeleton className="w-80 h-3 inline-block" />
          <FieldGroup>
            <div
              className={cn("grid items-center gap-4 sm:grid-cols-[7fr_3fr]")}
            >
              <Field>
                <FieldLabel htmlFor="name">
                  <Skeleton className="w-20 h-3" />
                </FieldLabel>
                <Skeleton className="w-full h-9" />
              </Field>
              <Field>
                <FieldLabel>
                  <Skeleton className="w-20 h-3" />
                </FieldLabel>
                <Skeleton className="w-full h-9" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="description">
                <Skeleton className="w-20 h-3" />
              </FieldLabel>
              <Skeleton className="w-full h-25" />
            </Field>

            <Field>
              <div className="flex gap-1">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-20 h-3" />
              </div>
              <div>
                <Skeleton className="h-3 w-80" />
              </div>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="w-40 h-3 my-4" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="w-40 h-3 my-4" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="w-40 h-3 my-4" />
                </div>
                <div className="flex gap-2 items-center">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="w-40 h-3 my-4" />
                </div>
              </div>
            </Field>

            <Field
              orientation="horizontal"
              className="justify-end flex-col sm:flex-row"
            >
              <Skeleton className="w-full sm:w-[60px] h-9" />
              <Skeleton className="w-full sm:w-[100px] h-9" />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </>
  );
};

export default LoadingPage;
