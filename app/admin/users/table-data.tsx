"use client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  CopyIcon,
  EllipsisVerticalIcon,
  HashIcon,
  MapPinHouseIcon,
  PlusIcon,
  SmartphoneIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import PageComponent from "@/components/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/components/user-context";
import {
  getUserDetailAction,
  type QueryUsersAPIRes,
  queryUserAction,
  type UserDetail,
} from "@/data/user";
import { buildSortField, cn, getShortName } from "@/lib/utils";
import FilterUser from "./filter-user";

const LoadingData = () => {
  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto @container">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right w-[130px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-30 h-3 rounded-full" />
                        <Skeleton className="w-20 h-2 rounded-full" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-12 h-3 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-12 h-3 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-9 h-3 inline-block" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center text-sm">
        <Skeleton className="shrink-0 hidden @2xl:block h-3 w-20" />

        <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
          <div className="@2xl:flex gap-2 items-center hidden">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-[70px]" />
          </div>

          <Skeleton className="h-3 w-20 @2xl:hidden" />

          <div className="flex items-center gap-2 @2xl:hidden">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
          <Pagination className="w-auto mx-0 hidden @2xl:flex">
            <PaginationContent>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

const ViewUserId = ({
  id,
  onClose,
}: {
  id: string | null;
  onClose: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserDetail | null>(null);

  React.useEffect(() => {
    setOpen(!!id);

    async function loadUser(id: string) {
      const user = await getUserDetailAction(id);
      setUser(user);
    }
    if (id) loadUser(id);
  }, [id]);

  console.log(user);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose();
          setUser(null);
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
                <Avatar className="bg-white size-14">
                  <AvatarImage
                    src={user.avatar?.url || "/images/logo-square.png"}
                    alt={user.username}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getShortName(user.username)}
                  </AvatarFallback>
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

const accessSearchParamKeys = [
  "email",
  "username",
  "status",
  "sort",
  "page",
  "limit",
];

const sortUserEnum = buildSortField([
  "username",
  "email",
  "status",
  "deactived_at",
  "created_at",
  "updated_at",
]);

function hasDuplicateKey(arr: string[]) {
  const keys = arr.map((item) => item.split(".")[0]); // lấy phần trước dấu "."
  const unique = new Set(keys);
  return unique.size !== keys.length; // nếu có trùng thì true
}

const UserTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { hasPermission } = useUser();
  const [viewId, setViewId] = React.useState<string | null>(null);

  const [isLoading, setLoading] = React.useState<boolean>(true);

  const [userData, setUserData] = React.useState<
    QueryUsersAPIRes["data"] | null
  >(null);

  React.useEffect(() => {
    const validateSearchParams = () => {
      // Kiểm tra khóa không hợp lệ
      const invalidKey = Array.from(searchParams.keys()).some(
        (k) => !accessSearchParamKeys.includes(k)
      );

      // Các key chỉ được có 1 giá trị
      const multiValueKeys = ["email", "username", "status", "page", "limit"];
      const hasMultipleValues = multiValueKeys.some(
        (key) => searchParams.getAll(key).length > 1
      );

      // Kiểm tra giá trị sort không hợp lệ
      const invalidSortValue = searchParams
        .getAll("sort")
        .some((v) => !sortUserEnum.includes(v));

      // Kiểm tra trùng sort key
      const hasDuplicateSort = hasDuplicateKey(searchParams.getAll("sort"));

      // Không được có cả email & username cùng lúc
      const hasEmailAndUsername =
        searchParams.has("email") && searchParams.has("username");

      return (
        invalidKey ||
        hasMultipleValues ||
        invalidSortValue ||
        hasDuplicateSort ||
        hasEmailAndUsername
      );
    };

    const buildValidSearchParams = () => {
      const newParams = new URLSearchParams();

      for (const [key, value] of searchParams.entries()) {
        if (!accessSearchParamKeys.includes(key)) continue;

        if (key === "sort") {
          if (!sortUserEnum.includes(value)) continue;

          const values = newParams.getAll(key);
          const [sortType] = value.split(".");
          const existing = values.find((v) => v.startsWith(sortType));
          if (existing) newParams.delete(key, existing);
          newParams.append(key, value);
        } else {
          newParams.set(key, value);
          // Không để tồn tại cả email & username
          const opposite = key === "email" ? "username" : "email";
          if (newParams.has(opposite)) newParams.delete(opposite);
        }
      }

      return newParams;
    };

    const fetchData = async () => {
      try {
        const { data } = await queryUserAction(searchParams.toString());
        setUserData(data);
      } catch (err) {
        console.error("Fetch user data failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (validateSearchParams()) {
      const newParams = buildValidSearchParams();
      const newUrl = `${pathName}?${newParams.toString()}`;
      if (newUrl !== `${pathName}?${searchParams.toString()}`) {
        router.push(newUrl);
      }
    } else {
      fetchData();
    }
  }, [searchParams, router, pathName]);

  const handleClose = () => {
    setViewId("");
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản người dùng </h3>

          {hasPermission("create:user") ? (
            <Link
              href="/admin/users/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "text-white"
              )}
            >
              <span className="hidden xs:inline ">Tạo người dùng mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          ) : null}
        </div>

        <FilterUser />

        {isLoading ? (
          <LoadingData />
        ) : (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto ">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right w-[130px]"></TableHead>
                    </TableRow>
                  </TableHeader>

                  {!userData || userData.users.length === 0 ? (
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-16">
                          <p>Không có kết quả...</p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>
                      {userData.users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="bg-white">
                                <AvatarImage
                                  src={
                                    u.avatar?.url || "/images/logo-square.png"
                                  }
                                  alt={u.username}
                                />
                                <AvatarFallback className="rounded-lg">
                                  {getShortName(u.username)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-base">
                                  {u.username}
                                </p>
                                <p className="text-sm">{u.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{u.role_count}</TableCell>
                          <TableCell>
                            {u.status === "ACTIVE"
                              ? "Hoạt động"
                              : "Vô hiệu hoá"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost">
                                  <EllipsisVerticalIcon className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-30" align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      navigator.clipboard.writeText("u.id");
                                      toast.info("Copy Id thành công.");
                                    }}
                                  >
                                    Sao chép ID
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setViewId(u.id);
                                    }}
                                  >
                                    Xem trước
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/users/${u.id}/edit`}>
                                      Chỉnh sửa
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Đặt lại mật khẩu
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>
            {userData?.metadata && userData.users.length > 0 ? (
              <PageComponent metadata={userData.metadata} />
            ) : null}
          </div>
        )}
      </div>
      <ViewUserId id={viewId} onClose={handleClose} />
    </div>
  );
};

export default UserTable;
