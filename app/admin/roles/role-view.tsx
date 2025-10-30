import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CopyIcon, HashIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import PermissionComponent from "@/components/permission";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleDetailAction } from "@/data/role";
import { cn } from "@/lib/utils";

type RoleViewProps = React.ComponentProps<typeof Sheet> & {
  id: string | null;
};
const RoleView = ({ id, children, ...props }: RoleViewProps) => {
  const { data: role, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ["role", id],
    queryFn: () => getRoleDetailAction(id ?? ""),
  });

  return (
    <Sheet {...props}>
      <SheetContent className="w-full xs:max-w-md sm:max-w-md gap-0 h-screen flex flex-col overflow-y-scroll">
        <SheetHeader className=" border-b py-1 gap-0">
          <SheetTitle className="flex items-center gap-2 max-w-[calc(100%_-_24px)]">
            <HashIcon className="shrink-0 w-5 h-5" />
            {!isLoading ? (
              <>
                <p className="truncate">{id}</p>
                <CopyIcon className="shrink-0 w-4 h-4" />
              </>
            ) : (
              <Skeleton className="h-3 w-40" />
            )}
          </SheetTitle>
          <SheetDescription>Chi tiết vai trò</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4 flex-1">
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-2">
              <Label>Tên vai trò</Label>
              {!isLoading ? (
                <p className="text-lg">{role?.name ?? "--"}</p>
              ) : (
                <Skeleton className="w-50 h-3" />
              )}
            </div>
            <div className="flex flex-col gap-2 ">
              <Label>Trạng thái</Label>
              {!isLoading ? (
                <p
                  className={cn(
                    "font-bold",
                    role
                      ? role?.status === "ACTIVE"
                        ? "text-green-500"
                        : "text-destructive"
                      : ""
                  )}
                >
                  {role
                    ? role.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Vô hiệu hoá"
                    : "--"}
                </p>
              ) : (
                <Skeleton className="w-10 h-2" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Mô tả</Label>
            {!isLoading ? (
              <p>
                {!role || role.description === "" ? "--" : role.description}
              </p>
            ) : (
              <>
                <Skeleton className="w-80 h-2" />
                <Skeleton className="w-96 h-2" />
                <Skeleton className="w-70 h-2" />
                <Skeleton className="w-40 h-2" />
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Ngày vô hiệu hoá</Label>
            {!isLoading ? (
              <p>
                {role?.deactived_at
                  ? format(
                      new Date(role.deactived_at).toISOString(),
                      "EEEE, dd/MM/yy HH:mm:ss 'GMT'XXX",
                      {
                        locale: vi,
                      }
                    )
                  : "--"}
              </p>
            ) : (
              <Skeleton className="w-40 h-2" />
            )}
          </div>

          <Separator orientation="horizontal" className="my-2" />

          <div className="flex flex-col gap-2">
            <Label>Quyền hạn </Label>

            {!isLoading ? (
              <PermissionComponent
                defaultPers={role?.permissions ?? []}
                viewMode
              />
            ) : (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((id) => (
                  <div
                    key={id}
                    className="flex flex-col gap-1 py-1 border-t first:border-none"
                  >
                    <Skeleton className="w-80 h-4" />
                    <Skeleton className="w-60 h-3" />
                    <Skeleton className="w-40 h-3" />
                    <div className="flex gap-1 flex-wrap">
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((idx) => (
                        <Skeleton key={idx} className="w-10 h-3" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="flex-row border-t">
          {!isLoading ? (
            role?.can_update ? (
              <Link
                href={`/admin/roles/${role.id}/edit`}
                className={cn("w-full", buttonVariants({ variant: "outline" }))}
              >
                Chỉnh Sửa
              </Link>
            ) : (
              <p className="text-center text-muted-foreground w-full">
                Không thể chỉnh sửa với vai trò này
              </p>
            )
          ) : (
            <Skeleton className="w-full h-9" />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RoleView;
