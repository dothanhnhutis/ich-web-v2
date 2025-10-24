import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CopyIcon, HashIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { getRoleDetailAction, type RoleDetail } from "@/data/role";
import { cn } from "@/lib/utils";

const RoleView = ({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [role, setRole] = React.useState<RoleDetail | null>(null);

  React.useEffect(() => {
    setOpen(!!id);

    async function fetchRole(id: string) {
      const role = await getRoleDetailAction(id);
      setRole(role);
    }
    if (id) fetchRole(id);
  }, [id]);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
          setRole(null);
        }
      }}
    >
      <SheetContent className="w-full xs:max-w-md sm:max-w-md gap-0 h-screen flex flex-col overflow-auto">
        <SheetHeader className="border-b py-1 gap-0">
          <SheetTitle className="flex items-center gap-2 max-w-[calc(100%_-_24px)]">
            <HashIcon className="shrink-0 w-5 h-5" />
            {role ? (
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
        <div className="flex flex-col gap-2 p-4 flex-1 overflow-hidden h-[2000px]">
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-2">
              <Label>Tên vai trò</Label>
              {role ? <p>{role.name}</p> : <Skeleton className="w-40 h-2" />}
            </div>
            <div className="flex flex-col gap-2 ">
              <Label>Trạng thái</Label>
              {role ? (
                <p
                  className={cn(
                    "font-bold",
                    role.status === "ACTIVE"
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {role.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
                </p>
              ) : (
                <Skeleton className="w-10 h-2" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Mô tả</Label>
            {role ? (
              <p>{role.description === "" ? "--" : role.description}</p>
            ) : (
              <Skeleton className="w-40 h-2" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Ngày vô hiệu hoá</Label>
            {role ? (
              <p>
                {role.deactived_at
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

          <Separator orientation="horizontal" />

          {true ? (
            <div>
              <Label>Vai trò </Label>
              <div className="max-h-[calc(100vh_-_326px)] overflow-y-scroll">
                <table className="min-w-full">
                  <tbody>
                    <tr>
                      <td className="p-2 align-middle">
                        <div className="flex flex-col gap-2 grow">
                          <Skeleton className="h-3 w-40 inline-block" />
                          <Skeleton className="h-2 w-20 inline-block" />
                        </div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-end">
                        <Skeleton className="h-3 w-10 inline-block" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 align-middle">
                        <div className="flex flex-col gap-2 grow">
                          <Skeleton className="h-4 w-40 inline-block" />
                          <Skeleton className="h-3 w-20 inline-block" />
                        </div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-end">
                        <Skeleton className="h-3 w-10 inline-block" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 align-middle">
                        <div className="flex flex-col gap-2 grow">
                          <Skeleton className="h-4 w-40 inline-block" />
                          <Skeleton className="h-3 w-20 inline-block" />
                        </div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-end">
                        <Skeleton className="h-3 w-10 inline-block" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 align-middle">
                        <div className="flex flex-col gap-2 grow">
                          <Skeleton className="h-4 w-40 inline-block" />
                          <Skeleton className="h-3 w-20 inline-block" />
                        </div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-end">
                        <Skeleton className="h-3 w-10 inline-block" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 align-middle">
                        <div className="flex flex-col gap-2 grow">
                          <Skeleton className="h-4 w-40 inline-block" />
                          <Skeleton className="h-3 w-20 inline-block" />
                        </div>
                      </td>
                      <td className="p-2 align-middle whitespace-nowrap text-end">
                        <Skeleton className="h-3 w-10 inline-block" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <Label>Vai trò ({role.user_count})</Label>
              {/* <div className="max-h-[calc(100vh_-_326px)] overflow-auto">
                <table className="min-w-full">
                  <tbody>
                    {users.roles.map((r) => (
                      <tr key={r.id}>
                        <td className="p-2 align-middle">
                          <div className="text-start">
                            <p className="text-base font-medium line-clamp-2">
                              {r.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {r.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-2 align-middle whitespace-nowrap text-end">
                          <p>{r.permissions.length}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>
          )}
        </div>

        <SheetFooter className="flex-row border-t">
          {role ? (
            <Link
              href={`/admin/users/${role.id}/edit`}
              className={cn("w-full", buttonVariants({ variant: "outline" }))}
            >
              Chỉnh Sửa
            </Link>
          ) : (
            <Skeleton className="w-full h-9" />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RoleView;
