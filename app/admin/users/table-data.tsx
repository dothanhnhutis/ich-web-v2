"use client";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  EllipsisVerticalIcon,
  FilterIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  UserSearchIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  return <div>{id}</div>;
};

const statusData = [
  {
    label: "Hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Vô hiệu hoá",
    value: "INACTIVE",
  },
];

const FilterUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchEmail, setSearchEmail] = React.useState<string>("");
  const [searchUsername, setSearchUsername] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (searchParams.has("email") && searchParams.has("username")) {
      let lastKey: string;
      for (const [key] of Array.from(searchParams.entries()).reverse()) {
        if (key === "email" || key === "username") {
          lastKey = key;
          break;
        }
      }

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("email");
      router.push(`/admin/users?${newSearchParams.toString()}`);
    } else {
      const paramSetters = {
        email: setSearchEmail,
        username: setSearchUsername,
      };
      Object.entries(paramSetters).forEach(([key, setter]) => {
        const value = searchParams.get(key);
        if (value) setter(value);
      });
    }

    // const paramSetters = {
    //   email: setSearchEmail,
    //   username: setSearchUsername,
    // };

    // if (searchParams.has("email") && searchParams.has("username")) {
    //   let lastKey: string;
    //   for (const [key] of Array.from(searchParams.entries()).reverse()) {
    //     if (key === "email" || key === "username") {
    //       lastKey = key;
    //       break;
    //     }
    //   }
    //   console.log(lastKey);
    //   Object.entries(paramSetters).forEach(([key, setter]) => {
    //     const value = searchParams.get(key);
    //     if (value) {
    //       if (key === "email" || key === "username") {

    //       } else {
    //         setter(value);
    //       }
    //     }
    //   });
    // } else {
    //   Object.entries(paramSetters).forEach(([key, setter]) => {
    //     const value = searchParams.get(key);
    //     if (value) setter(value);
    //   });
    // }
  }, [searchParams, router]);

  return (
    <div className="relative grid gap-4 border rounded-md p-3">
      <Label>Bộ lọc</Label>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kím bằng email"
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
            }}
          />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn("p-0", searchEmail.length === 0 ? "hidden" : "block")}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchEmail("");
                if (newSearchParams.has("email")) {
                  newSearchParams.delete("email");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`/admin/users?${newSearchParams.toString()}`);
                }
              }}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="pr-2">
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                if (searchEmail !== "") {
                  if (newSearchParams.has("username")) {
                    newSearchParams.delete("username");
                  }
                  newSearchParams.set("email", searchEmail);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                } else {
                  newSearchParams.delete("email");
                }
                router.push(`/admin/users?${newSearchParams.toString()}`);
              }}
            >
              <SearchIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kím bằng tên"
            value={searchUsername}
            onChange={(e) => {
              setSearchUsername(e.target.value);
            }}
          />
          <InputGroupAddon>
            <UserSearchIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn(
              "p-0",
              searchUsername.length === 0 ? "hidden" : "block"
            )}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchUsername("");
                if (newSearchParams.has("username")) {
                  newSearchParams.delete("username");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`/admin/users?${newSearchParams.toString()}`);
                }
              }}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="pr-2">
            <Button
              variant={"ghost"}
              size={"icon-sm"}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                if (searchUsername !== "") {
                  if (newSearchParams.has("email")) {
                    newSearchParams.delete("email");
                  }
                  newSearchParams.set("username", searchUsername);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  setSearchUsername("");
                } else {
                  newSearchParams.delete("username");
                }
                router.push(`/admin/users?${newSearchParams.toString()}`);
              }}
            >
              <SearchIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <div className="relative flex gap-4 items-center w-full sm:w-[180px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex w-full shrink justify-between hover:bg-transparent text-start text-sm font-normal",
                  status === ""
                    ? "text-muted-foreground hover:text-muted-foreground"
                    : "hover:text-black"
                )}
              >
                <span>
                  {status === ""
                    ? "Trạng thái"
                    : status === "ACTIVE"
                    ? "Hoạt động"
                    : "Vô hiệu hoá"}
                </span>
                <ChevronDownIcon className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]"
              align="end"
              side="bottom"
            >
              <Command>
                <CommandList>
                  <CommandGroup heading="Trạng thái">
                    {statusData.map((s) => (
                      <CommandItem
                        key={s.label}
                        value={s.value}
                        onSelect={(currentValue) => {
                          setStatus(
                            currentValue === status ? "" : currentValue
                          );
                          setOpen(false);

                          const newSearchParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          if (currentValue === status) {
                            newSearchParams.delete("status");
                          } else {
                            newSearchParams.set("status", currentValue);
                          }
                          newSearchParams.set("page", "1");
                          newSearchParams.set("limit", "10");
                          router.push(
                            `/admin/users?${newSearchParams.toString()}`
                          );
                        }}
                      >
                        {s.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto",
                            status === s.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <FilterIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Email</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo email</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Họ và tên</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo tên người dùng</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Trạng Thái</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo trạng thái</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Ngày vô hiệu hoá</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo ngày vô hiệu hoá</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Ngày tạo</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo ngày tạo</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-2 p-1">
                <div className="flex gap-2 justify-between items-center">
                  <Label>Ngày cập nhật</Label>
                  <Switch />
                </div>
                <div className="flex gap-2 items-center justify-between">
                  <p className="text-sm">Sắp xếp theo ngày cập nhật</p>
                  <ToggleGroup variant="outline" type="single">
                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                      <p>Tăng</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                      <p>Giảm</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between">
                <Button type="button" variant={"outline"}>
                  Đặt lại
                </Button>
                <Button>Áp dụng</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const UserTable = () => {
  const [viewId, setViewId] = React.useState<string | null>(null);
  const router = useRouter();
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

        <FilterUser />

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
                                    const newSearchParams = new URLSearchParams(
                                      searchParams.toString()
                                    );
                                    if (currentValue === "All") {
                                      newSearchParams.delete("limit");
                                    } else {
                                      newSearchParams.set(
                                        "limit",
                                        currentValue
                                      );
                                    }
                                    router.push(
                                      `/admin/users?${newSearchParams.toString()}`
                                    );
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
                                    const newSearchParams = new URLSearchParams(
                                      searchParams.toString()
                                    );
                                    if (currentValue === "All") {
                                      newSearchParams.delete("limit");
                                    } else {
                                      newSearchParams.set(
                                        "limit",
                                        currentValue
                                      );
                                    }
                                    router.push(
                                      `/admin/users?${newSearchParams.toString()}`
                                    );
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
                    )} / ${userData.metadata.totalPage}`}
                  </p>

                  <div className="flex items-center gap-2 @2xl:hidden">
                    <Button
                      disabled={userData.metadata.itemStart === 1}
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        newSearchParams.set("page", "1");
                        router.push(
                          `/admin/users?${newSearchParams.toString()}`
                        );
                      }}
                    >
                      <ChevronsLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      disabled={userData.metadata.itemStart === 1}
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        const currentPage =
                          Math.ceil(
                            userData.metadata.itemEnd / userData.metadata.limit
                          ) - 1;
                        const newSearchParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        newSearchParams.set("page", currentPage.toString());
                        router.push(
                          `/admin/users?${newSearchParams.toString()}`
                        );
                      }}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      disabled={
                        userData.metadata.totalPage.toString() ===
                        searchParams.get("page")
                      }
                      onClick={() => {
                        const currentPage =
                          Math.ceil(
                            userData.metadata.itemEnd / userData.metadata.limit
                          ) + 1;
                        const newSearchParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        newSearchParams.set("page", currentPage.toString());
                        router.push(
                          `/admin/users?${newSearchParams.toString()}`
                        );
                      }}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      disabled={
                        userData.metadata.totalPage.toString() ===
                        searchParams.get("page")
                      }
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        newSearchParams.set(
                          "page",
                          userData.metadata.totalPage.toString()
                        );
                        router.push(
                          `/admin/users?${newSearchParams.toString()}`
                        );
                      }}
                    >
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
                          onClick={() => {
                            const currentPage =
                              Math.ceil(
                                userData.metadata.itemEnd /
                                  userData.metadata.limit
                              ) - 1;
                            const newSearchParams = new URLSearchParams(
                              searchParams.toString()
                            );
                            newSearchParams.set("page", currentPage.toString());
                            router.push(
                              `/admin/users?${newSearchParams.toString()}`
                            );
                          }}
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
                        if (p.toString() === searchParams.get("page"))
                          return (
                            <PaginationItem key={p}>
                              <button
                                type="button"
                                className="h-9 w-9 shrink-0 text-center align-middle border rounded-md text-primary border-primary"
                              >
                                {p}
                              </button>
                            </PaginationItem>
                          );
                        return (
                          <PaginationItem key={p}>
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              onClick={() => {
                                const newSearchParams = new URLSearchParams(
                                  searchParams.toString()
                                );
                                newSearchParams.set("page", p.toString());
                                router.push(
                                  `/admin/users?${newSearchParams.toString()}`
                                );
                              }}
                            >
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
                          onClick={() => {
                            const currentPage =
                              Math.ceil(
                                userData.metadata.itemEnd /
                                  userData.metadata.limit
                              ) + 1;
                            const newSearchParams = new URLSearchParams(
                              searchParams.toString()
                            );
                            newSearchParams.set("page", currentPage.toString());
                            router.push(
                              `/admin/users?${newSearchParams.toString()}`
                            );
                          }}
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
      {viewId && <ViewUserId id={viewId} />}
    </div>
  );
};

export default UserTable;
