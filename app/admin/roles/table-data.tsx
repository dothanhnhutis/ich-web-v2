"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
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
import type { Role } from "@/data/role";

const RoleTable = ({
  roles,
  onViewRole,
}: {
  roles?: Role[];
  onViewRole?: (id: string) => void;
}) => {
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
        {roles && roles.length > 0 ? (
          roles.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell>{r.description}</TableCell>
              <TableCell className="text-center">{r.user_count}</TableCell>
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
                      <DropdownMenuItem asChild disabled={!r.canupdate}>
                        <Link href={`/admin/roles/${r.id}/edit`}>
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>{" "}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={!r.candelete}
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
