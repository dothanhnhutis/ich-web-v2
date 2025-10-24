"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import PageComponent from "@/components/page";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryRolesAction, type Role } from "@/data/role";

const RoleTable = ({ roles }: { roles: Role[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên vai trò</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead className="text-center w-[130px]">Người dùng</TableHead>
          <TableHead className="text-right w-[130px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Admin</TableCell>
          <TableCell>Vai trò này có quyền cao nhất trong hệ thống</TableCell>
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
                <DropdownMenuItem variant="destructive">Xoá</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default RoleTable;
