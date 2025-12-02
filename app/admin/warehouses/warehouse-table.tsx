"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import Image from "next/image";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/components/user-context";
import type { FindManyWarehouseAction } from "@/data/warehouse/findManyWarehouseAction";
import { convertImage } from "@/lib/utils";

const WarehouseTable = ({
  warehouses,
  onViewWarehouse,
  onDeleteWarehouse,
}: {
  warehouses?: FindManyWarehouseAction["warehouses"];
  onViewWarehouse?: (warehouseId: string) => void;
  onDeleteWarehouse?: (warehouseId: string) => void;
}) => {
  const { hasPermission } = useUser();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên nhà kho</TableHead>
          <TableHead>Địa chỉ</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-center">Số sản phẩm</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {warehouses && warehouses.length > 0 ? (
          warehouses.map((w) => (
            <TableRow key={w.id}>
              <TableCell className="font-medium min-w-[100px] max-w-[200px]">
                {w.name}
              </TableCell>
              <TableCell className="min-w-[250px] max-w-[500px]">
                <p className="truncate">{w.address}</p>
              </TableCell>
              <TableCell>
                {w.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
              </TableCell>
              <TableCell className="text-center">
                {w.packaging_count > 0 ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">{w.packaging_count}</Button>
                    </HoverCardTrigger>

                    <HoverCardContent
                      className="max-h-[274px] w-92 flex flex-col gap-2 overflow-auto p-2"
                      side="bottom"
                      align="center"
                    >
                      {w.packagings.map((p) => (
                        <div key={p.id} className="flex gap-2">
                          <Image
                            src={
                              p.image
                                ? convertImage(p.image).url
                                : "/icons/box5.png"
                            }
                            alt="image"
                            width={p.image?.width || 192}
                            height={p.image?.height || 192}
                            className="size-[80px] rounded-sm bg-accent"
                          />

                          <div className="space-y-1 w-full">
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {p.name}
                            </h4>
                            {p.unit === "CARTON" ? (
                              <div className="flex flex-col gap-1 text-muted-foreground text-xs">
                                <p>Quy cách: {p.pcs_ctn} / Thùng</p>
                                <p>Số lượng: {p.quantity} thùng</p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground text-xs">
                                Số lượng: {p.quantity} thùng
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant={"secondary"}
                        onClick={() => {
                          if (onViewWarehouse) {
                            onViewWarehouse(w.id);
                          }
                        }}
                      >
                        Xem hết
                      </Button>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  w.packaging_count
                )}
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
                          navigator.clipboard.writeText(w.id);
                          toast.info("Copy Id thành công.");
                        }}
                      >
                        Sao chép ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onViewWarehouse) {
                            onViewWarehouse(w.id);
                          }
                        }}
                      >
                        Xem trước
                      </DropdownMenuItem>
                      {hasPermission("update:role") && (
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/warehouses/${w.id}/edit`}>
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>

                    {hasPermission("delete:role") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            if (onDeleteWarehouse) onDeleteWarehouse(w.id);
                          }}
                        >
                          Xoá
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
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

export default WarehouseTable;
