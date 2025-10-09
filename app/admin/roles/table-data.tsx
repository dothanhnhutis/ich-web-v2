"use client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
  EllipsisVerticalIcon,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const frameworks = ["10", "20", "30", "40", "50", "All"];

const RoleTable = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("10");
  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto @container">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center w-[130px]">
                  Người dùng
                </TableHead>
                <TableHead className="text-right w-[130px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Admin</TableCell>
                <TableCell>
                  Vai trò này có quyền cao nhất trong hệ thống
                </TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-right">
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

export default RoleTable;
