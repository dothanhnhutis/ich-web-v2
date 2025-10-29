"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
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
import type { QueryRolesAction } from "@/data/role";
import { convertImage, getShortName } from "@/lib/utils";

const RoleTable = ({
  roles,
  onViewRole,
}: {
  roles?: QueryRolesAction["roles"];
  onViewRole?: (id: string) => void;
}) => {
  const { hasPermission } = useUser();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên vai trò</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Tài khoản</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles && roles.length > 0 ? (
          roles.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium min-w-[200px]">
                {r.name}
              </TableCell>
              <TableCell className="max-w-[700px]">
                <p className="truncate">{r.description}</p>
              </TableCell>
              <TableCell className="text-center">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
                  {r.users.map((u) => (
                    <Avatar key={u.id} className="bg-white">
                      <AvatarImage
                        src={
                          u.avatar
                            ? convertImage(u.avatar).url
                            : "/images/logo-square.png"
                        }
                        alt={u.avatar?.file_name || u.username}
                      />
                      <AvatarFallback>
                        {getShortName(u.username)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {r.user_count > 3 && (
                    <Avatar>
                      <AvatarFallback>+{r.user_count - 3}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {r.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
              </TableCell>
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
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(r.id);
                          toast.info("Copy Id thành công.");
                        }}
                      >
                        Sao chép ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onViewRole) {
                            onViewRole(r.id);
                          }
                        }}
                      >
                        Xem trước
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild disabled={!r.can_update}>
                        <Link href={`/admin/roles/${r.id}/edit`}>
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>{" "}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={!r.can_delete || !hasPermission("update:role")}
                    >
                      Xoá
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center h-12
            "
            >
              Không có kết quả.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default RoleTable;
