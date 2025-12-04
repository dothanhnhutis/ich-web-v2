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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/components/user-context";
import type { FindManyPackagingAction } from "@/data/packaging/findManyPackagingAction";
import PackagingAlert from "./packaging-alert";

const PackagingTable = ({
  packagings,
  onViewPackaging,
  onDeletePackaging,
}: {
  packagings?: FindManyPackagingAction["packagings"];
  onViewPackaging?: (warehouseId: string) => void;
  onDeletePackaging?: (warehouseId: string) => void;
}) => {
  const { hasPermission } = useUser();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên bao bì</TableHead>
          <TableHead className="text-center">Trạng thái</TableHead>
          <TableHead className="text-center">Số lượng</TableHead>
          <TableHead className="text-center">Đơn vị lưu trữ</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {packagings && packagings.length > 0 ? (
          packagings.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-center">
                {p.status === "ACTIVE" ? "Hoạt động" : "Vô hiệu hoá"}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {p.total_quantity > 0 ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="link" className="p-0">
                          {p.total_quantity}
                        </Button>
                      </HoverCardTrigger>

                      <HoverCardContent
                        className="max-h-[240px] w-80 flex flex-col gap-2 overflow-auto p-2"
                        side="bottom"
                        align="center"
                      >
                        {p.warehouses.map((w) => (
                          <div
                            key={w.id}
                            className="space-y-1 w-full border-t first:border-none pt-2"
                          >
                            <h4 className="text-sm font-semibold line-clamp-2">
                              {w.name}
                            </h4>
                            <div className="flex flex-col gap-1 text-muted-foreground text-xs">
                              <p>{w.address}</p>
                              <p>
                                {`Số lượng: ${w.quantity} ${
                                  p.unit === "CARTON" ? "Thùng" : "Cái"
                                }`}
                              </p>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant={"secondary"}
                          onClick={() => {
                            if (onViewPackaging) {
                              onViewPackaging(p.id);
                            }
                          }}
                        >
                          Xem hết
                        </Button>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <p>{p.total_quantity}</p>
                  )}
                  <PackagingAlert
                    min_stock_level={p.min_stock_level}
                    total_quantity={p.total_quantity}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center text-center gap-1 h-full">
                  <p>{p.unit === "CARTON" ? "Thùng" : "Cái"}</p>
                  {p.unit === "CARTON" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="center">
                        <p>Quy cách: {p.pcs_ctn} cái / Thùng </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
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
                          navigator.clipboard.writeText(p.id);
                          toast.info("Copy Id thành công.");
                        }}
                      >
                        Sao chép ID
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (onViewPackaging) {
                            onViewPackaging(p.id);
                          }
                        }}
                      >
                        Xem trước
                      </DropdownMenuItem>
                      {hasPermission("update:role") && (
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/warehouses/${p.id}/edit`}>
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
                            if (onDeletePackaging) onDeletePackaging(p.id);
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

export default PackagingTable;
