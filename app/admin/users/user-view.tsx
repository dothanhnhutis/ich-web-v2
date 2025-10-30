"use client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CopyIcon, HashIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getUserDetailAction } from "@/data/user";
import { cn, convertImage, getShortName } from "@/lib/utils";

type UserViewProps = {
  id: string | null;
  onClose: () => void;
};

const UserView = ({ id, onClose }: UserViewProps) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const { data: user, isPending } = useQuery({
    enabled: !!id,
    queryKey: ["user", id],
    queryFn: () => getUserDetailAction(id ?? ""),
  });

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <SheetContent className="w-full xs:max-w-md sm:max-w-md gap-0 h-screen flex flex-col">
        <SheetHeader className="border-b py-1 gap-0">
          <SheetTitle className="flex items-center gap-2 max-w-[calc(100%_-_24px)]">
            <HashIcon className="shrink-0 w-5 h-5" />
            {user ? (
              <>
                <p className="truncate">{id}</p>
                <CopyIcon className="shrink-0 w-4 h-4" />
              </>
            ) : (
              <Skeleton className="h-3 w-40" />
            )}
          </SheetTitle>
          <SheetDescription>Chi tiết tài khoản</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4 flex-1 overflow-hidden">
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-2">
              <Label>Ngày vô hiệu hoá</Label>
              {user ? (
                <p>
                  {user.deactived_at
                    ? format(
                        new Date(user.deactived_at).toISOString(),
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
            <div className="flex flex-col gap-2 ">
              <Label>Trạng thái</Label>
              {user ? (
                <p
                  className={cn(
                    "font-bold",
                    user.status === "ACTIVE"
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {user.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
                </p>
              ) : (
                <Skeleton className="w-10 h-2" />
              )}
            </div>
          </div>
          <Separator orientation="horizontal" />
          <div className="grid gap-2 w-full">
            <Label>Thông tin người dùng </Label>
            {user ? (
              <div className="flex gap-2">
                <Avatar className="size-9 group-hover:hidden bg-white">
                  <AvatarImage
                    src={
                      user.avatar
                        ? convertImage(user.avatar).url
                        : "/images/logo-square.png"
                    }
                    alt={user.avatar?.file_name || user.username}
                  />
                  <AvatarFallback>{getShortName(user.username)}</AvatarFallback>
                </Avatar>
                <div className="grid">
                  <p className="font-bold text-lg">Do Thanh Nhut</p>
                  <p className="text-sm">gaconght@gmail.com</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Skeleton className="rounded-full h-14 w-14" />
                <div className="grid">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-60" />
                </div>
              </div>
            )}
          </div>
          <Separator orientation="horizontal" />
          {!user ? (
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
              <Label>Vai trò ({user.role_count})</Label>
              <div className="max-h-[calc(100vh_-_326px)] overflow-auto">
                <table className="min-w-full">
                  <tbody>
                    {user.roles.map((r) => (
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
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="flex-row border-t">
          {user ? (
            <Link
              href={`/admin/users/${user.id}/edit`}
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

export default UserView;
