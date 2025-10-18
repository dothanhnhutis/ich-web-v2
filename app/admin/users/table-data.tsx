"use client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  EllipsisVerticalIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
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
import { type QueryUsersAPIRes, queryUserAction } from "@/data/user";
import calcPages from "@/lib/calcPages";
import { cn, getShortName } from "@/lib/utils";

const itemPerPages = ["10", "20", "30", "40", "50", "All"];

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

const UserTable = () => {
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [itemPerPage, setItemPerPage] = React.useState<string>("10");
  const { hasPermission } = useUser();

  const [isLoading, setLoading] = React.useState<boolean>(true);

  const [userData, setUserData] = React.useState<
    QueryUsersAPIRes["data"] | null
  >(null);

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await queryUserAction(searchParams.toString());
      setUserData(data);
      if (data.metadata) {
        setItemPerPage(`${data.metadata.limit}`);
      }
      setLoading(false);
    }
    fetchData();
  }, [searchParams]);

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

        {isLoading ? (
          <LoadingData />
        ) : (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto @container">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead className="text-right w-[130px]"></TableHead>
                    </TableRow>
                  </TableHeader>

                  {!userData || userData.users.length === 0 ? (
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-16">
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
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost">
                                  <EllipsisVerticalIcon className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-30"
                                align="start"
                              >
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                  <DropdownMenuItem>
                                    Sao chép ID
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive">
                                  Xoá
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
              <div className="flex items-center text-sm">
                <p className="shrink-0 hidden @2xl:block">
                  {`${userData.metadata.itemStart} - ${userData.metadata.itemEnd} / ${userData.metadata.totalItem} Kết quả`}
                </p>

                <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
                  <div className="@2xl:flex gap-2 items-center hidden">
                    <p className="shrink-0">Hàng trên mỗi trang</p>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[70px] justify-between"
                        >
                          {itemPerPage}
                          {/* {itemPerPage
                            ? itemPerPages.find((item) => item === itemPerPage)
                            : "Chọn..."} */}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[70px] p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {itemPerPages.map((item) => (
                                <CommandItem
                                  key={item}
                                  value={item}
                                  onSelect={(currentValue) => {
                                    setItemPerPage(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  {item}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto",
                                      itemPerPage === item
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}

                              {!itemPerPages.includes(itemPerPage) ? (
                                <CommandItem
                                  value={itemPerPage}
                                  onSelect={(currentValue) => {
                                    setItemPerPage(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  {itemPerPage}
                                  <CheckIcon className="ml-auto opacity-100" />
                                </CommandItem>
                              ) : null}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <p className="@2xl:hidden">
                    {`Trang ${Math.ceil(
                      userData.metadata.itemEnd / userData.metadata.limit
                    )} / ${Math.ceil(
                      userData.metadata.totalItem / userData.metadata.limit
                    )}`}
                  </p>

                  <div className="flex items-center gap-2 @2xl:hidden">
                    <Button disabled variant={"outline"} size={"icon"}>
                      <ChevronsLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button disabled variant={"outline"} size={"icon"}>
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button variant={"outline"} size={"icon"}>
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                    <Button variant={"outline"} size={"icon"}>
                      <ChevronsRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <Pagination className="w-auto mx-0 hidden @2xl:flex">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          disabled={userData.metadata.itemStart === 1}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <ChevronLeftIcon className="w-4 h-4" />
                        </Button>
                      </PaginationItem>

                      {calcPages({
                        totalPage: userData.metadata.totalPage,
                        currPage: Math.ceil(
                          userData.metadata.itemEnd / userData.metadata.limit
                        ),
                        // totalPage: 10,
                        // currPage: 5,
                      }).map((p) => {
                        if (p === "…")
                          return (
                            <PaginationItem key={p}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        return (
                          <PaginationItem key={p}>
                            <Button variant={"outline"} size={"icon"}>
                              {p}
                            </Button>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          disabled={!userData.metadata.hasNextPage}
                        >
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
