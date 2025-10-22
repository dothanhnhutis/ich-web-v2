"use client";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  CopyIcon,
  EllipsisVerticalIcon,
  HashIcon,
  MailIcon,
  MapPinHouseIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SmartphoneIcon,
  UserIcon,
  UserSearchIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
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
  SheetTrigger,
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
import { type QueryUsersAPIRes, queryUserAction } from "@/data/user";
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

const ViewUserId = ({ id }: { id: string }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("10");

  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto @container">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Ngày Lập Phiếu</TableHead>
                <TableHead className="text-center w-[130px]">Loại</TableHead>
                <TableHead className="text-center w-[130px]">Bao Bì</TableHead>
                <TableHead className="w-[400px]">Ghi chú</TableHead>
                <TableHead className="text-right w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="w-[200px]">
                  {new Date().toISOString()}
                </TableCell>
                <TableCell className="text-center w-[130px]">Nhập</TableCell>

                <TableCell className="text-center w-[130px]">100</TableCell>
                <TableCell className="truncate w-[400px]">
                  Số 159 Nguyễn Đình Chiểu, Khóm 3, Phường Phú Lợi, TP Cần Thơ
                </TableCell>
                <TableCell className="text-right w-[50px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <EllipsisVerticalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-30" align="start">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>Sao chép ID</DropdownMenuItem>
                        <DropdownMenuItem>Xem nhanh</DropdownMenuItem>
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
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        {/* <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-name">Name</Label>
              <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-demo-username">Username</Label>
              <Input id="sheet-demo-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent> */}

        <SheetContent className="w-full xs:max-w-lg sm:max-w-lg gap-0 h-screen flex flex-col">
          <SheetHeader className="border-b py-1 gap-0">
            <SheetTitle className="flex items-center gap-2 max-w-[calc(100%_-_24px)]">
              <HashIcon className="shrink-0 w-5 h-5" />
              <p className="truncate">
                <span>1s32d132asd1as32d3as21d3s2a13d21as321das31d3as13d1</span>
              </p>
              <CopyIcon className="shrink-0 w-4 h-4" />{" "}
            </SheetTitle>
            <SheetDescription>Chi tiết phiếu bao bì</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-4 flex-1 overflow-hidden">
            <div className="flex justify-between gap-1">
              <div className="flex flex-col gap-2">
                <Label>Ngày lập phiếu</Label>
                <p>
                  {format(
                    new Date().toISOString(),
                    "EEEE, dd/MM/yy HH:mm:ss 'GMT'XXX",
                    {
                      locale: vi,
                    }
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Loại phiếu</Label>
                <OrderStatus status={"CANCELED"} />
              </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="grid gap-1 w-full">
              <Label>Người lập phiếu</Label>
              <div className="flex gap-2 items-center">
                <UserIcon className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-base lg:text-lg">Nhut</p>
              </div>

              <div className="flex gap-2 items-center">
                <SmartphoneIcon className="size-4 shrink-0 text-muted-foreground" />
                <p className="lg:text-base text-sm ">123456789</p>
              </div>

              <div className="flex gap-2 items-center">
                <MapPinHouseIcon className="size-4 shrink-0 text-muted-foreground" />
                <p className="lg:text-base text-sm"></p>
              </div>
            </div>
            <Separator orientation="horizontal" />
            {false ? (
              <>
                {" "}
                <div>
                  <p className="text-sm">Sản Phẩm</p>
                  <div className="max-h-[calc(100vh_-_421px)] overflow-y-scroll">
                    <table className="min-w-full">
                      <tbody>
                        <tr>
                          <td className="p-2 align-middle">
                            <div className="flex gap-2 ">
                              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                              <div className="flex flex-col gap-2 grow">
                                <Skeleton className="h-4 w-40 inline-block" />
                                <Skeleton className="h-3 w-20 inline-block" />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-middle">
                            <div className="flex gap-2 ">
                              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                              <div className="flex flex-col gap-2 grow">
                                <Skeleton className="h-4 w-40 inline-block" />
                                <Skeleton className="h-3 w-20 inline-block" />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-middle">
                            <div className="flex gap-2 ">
                              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                              <div className="flex flex-col gap-2 grow">
                                <Skeleton className="h-4 w-40 inline-block" />
                                <Skeleton className="h-3 w-20 inline-block" />
                              </div>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <Skeleton className="h-3 w-10 inline-block" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <Separator orientation="horizontal" />
                <div className="flex items-center justify-between gap-2">
                  <p>Tổng</p>
                  <Skeleton className="h-3 w-10 inline-block" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm">Sản Phẩm (2)</p>
                  <div className="max-h-[calc(100vh_-_421px)] overflow-auto">
                    <table className="min-w-full">
                      <tbody>
                        <tr>
                          <td className="p-2 align-middle">
                            <div className="flex gap-2">
                              <div className="w-16 h-16 bg-accent rounded-lg overflow-hidden shrink-0">
                                <Image
                                  src={`/products/product-1.jpg`}
                                  alt={"product.image.filename"}
                                  width={1280}
                                  height={1280}
                                  priority={false}
                                  className="object-contain aspect-square"
                                />
                              </div>
                              <div className="text-start">
                                <p className="text-base font-medium line-clamp-2">
                                  Tên sản phâm
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Kho hàng A
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <p>
                              {new Intl.NumberFormat("de-DE").format(10000)}
                            </p>
                          </td>
                          <td className="p-2 align-middle whitespace-nowrap text-end">
                            <p>
                              {new Intl.NumberFormat("de-DE").format(100000)}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <Separator orientation="horizontal" />
                <div className="flex items-center justify-between gap-2">
                  <p>Tổng</p>
                  <p>{new Intl.NumberFormat("de-DE").format(1000000)}</p>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="flex-row border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-1/2">
                  Trạng thái
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {status.map((status) => (
                    <DropdownMenuItem key={status} className="justify-between">
                      <OrderStatus status={status} />
                      <CheckIcon className="shrink-0 w-4 h-4" />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button type="submit" className="w-1/2">
              Cập nhật
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="flex items-center text-sm">
        <p className="shrink-0 hidden @2xl:block">1 - 10 / 100 Kết quả</p>

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
                  {value
                    ? frameworks.find((framework) => framework === value)
                    : "Select framework..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[70px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework}
                          value={framework}
                          onSelect={(currentValue) => {
                            setValue(currentValue);
                            setOpen(false);
                          }}
                        >
                          {framework}
                          <CheckIcon
                            className={cn(
                              "ml-auto",
                              value === framework ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <p className="@2xl:hidden">Trang 1 / 10</p>

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
                <Button disabled variant={"outline"} size={"icon"}>
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant={"outline"} size={"icon"}>
                  1
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant={"outline"} size={"icon"}>
                  2
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant={"outline"} size={"icon"}>
                  3
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button variant={"outline"} size={"icon"}>
                  7
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant={"outline"} size={"icon"}>
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
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
    async function fetchData() {
      // await awaitCus(10000);
      const { data } = await queryUserAction(searchParams.toString());
      setUserData(data);
      setLoading(false);
    }

    const checkValidKey = Array.from(searchParams.keys()).some(
      (k) => !accessSearchParamKeys.includes(k)
    );

    const checkSingleValue = [
      "email",
      "username",
      "status",
      "page",
      "limit",
    ].some((key) => searchParams.getAll(key).length > 1);

    const checkSortValue = searchParams
      .getAll("sort")
      .some((v) => !sortUserEnum.includes(v));

    const checkDoubleSortKey = hasDuplicateKey(searchParams.getAll("sort"));

    const checkHasEmailAndUserName =
      searchParams.has("email") && searchParams.has("username");

    if (
      checkValidKey ||
      checkSingleValue ||
      checkSortValue ||
      checkHasEmailAndUserName ||
      checkDoubleSortKey
    ) {
      const newSearchParams = new URLSearchParams();

      for (const [k, v] of Array.from(searchParams.entries())) {
        if (accessSearchParamKeys.includes(k)) {
          if (k === "sort") {
            if (sortUserEnum.includes(v)) {
              const values = newSearchParams.getAll(k);
              console.log(values);
              const [sortType] = v.split(".");
              const hasSortType = values.find((value) =>
                value.startsWith(sortType)
              );
              if (hasSortType) {
                newSearchParams.delete(k, hasSortType);
              }
              newSearchParams.append(k, v);
            }
          } else {
            newSearchParams.set(k, v);
            if (newSearchParams.has(k === "email" ? "username" : "email"))
              newSearchParams.delete(k === "email" ? "username" : "email");
          }
        }
      }
      router.push(`${pathName}?${newSearchParams.toString()}`);
    } else {
      fetchData();
    }
  }, [searchParams, router, pathName]);

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
                                  <DropdownMenuItem>
                                    Sao chép ID
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setViewId(u.id);
                                    }}
                                  >
                                    Xem trước
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
              <PageComponent metadata={userData.metadata} />
            ) : null}
          </div>
        )}
      </div>
      {viewId && <ViewUserId id={viewId} />}
    </div>
  );
};

export default UserTable;
