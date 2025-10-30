"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useUser } from "@/components/user-context";
import type { UserWithoutPassword } from "@/data/user";
import { convertImage, getShortName } from "@/lib/utils";

type UserTableProps = {
  users: UserWithoutPassword[];
  onViewUser?: (userId: string) => void;
  onResetUserPassword?: (userId: string) => void;
};

const UserTable = ({
  users,
  onViewUser,
  onResetUserPassword,
}: UserTableProps) => {
  const { hasPermission } = useUser();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Người dùng</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right w-[130px]"></TableHead>
        </TableRow>
      </TableHeader>

      {users.length === 0 ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} className="text-center h-12">
              <p>Không có kết quả...</p>
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-9 group-hover:hidden bg-white">
                    <AvatarImage
                      src={
                        u.avatar
                          ? convertImage(u.avatar).url
                          : "/images/logo-square.png"
                      }
                      alt={u.avatar?.file_name || u.username}
                    />
                    <AvatarFallback>{getShortName(u.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-base">{u.username}</p>
                    <p className="text-sm">{u.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{u.role_count}</TableCell>
              <TableCell>
                {u.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
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
                          navigator.clipboard.writeText(u.id);
                          toast.info("Copy Id thành công.");
                        }}
                      >
                        Sao chép ID
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          if (onViewUser) {
                            onViewUser(u.id);
                          }
                        }}
                      >
                        Xem trước
                      </DropdownMenuItem>
                      {hasPermission("update:user") && (
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/roles/${u.id}/edit`}>
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>

                    {hasPermission("reset:user:password") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            if (onResetUserPassword) onResetUserPassword(u.id);
                          }}
                        >
                          Đặt lại mật khẩu
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default UserTable;
