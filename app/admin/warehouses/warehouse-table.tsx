"use client";
import { EllipsisVerticalIcon } from "lucide-react";
import Image from "next/image";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
                      className="max-h-72 w-96 relative overflow-auto"
                      side="right"
                      align="start"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <div className="size-[60px] bg-accent"></div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">Ten bao bi</h4>
                          <p className="text-sm"></p>
                          <div className="text-muted-foreground text-xs">
                            Số lượng: 1000
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by
                            @vercel.
                          </p>
                          <div className="text-muted-foreground text-xs">
                            Joined December 2021
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by
                            @vercel.
                          </p>
                          <div className="text-muted-foreground text-xs">
                            Joined December 2021
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by
                            @vercel.
                          </p>
                          <div className="text-muted-foreground text-xs">
                            Joined December 2021
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by
                            @vercel.
                          </p>
                          <div className="text-muted-foreground text-xs">
                            Joined December 2021
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between gap-4">
                        <Avatar>
                          <AvatarImage src="https://github.com/vercel.png" />
                          <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@nextjs</h4>
                          <p className="text-sm">
                            The React Framework – created and maintained by
                            @vercel.
                          </p>
                          <div className="text-muted-foreground text-xs">
                            Joined December 2021
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  w.packaging_count
                )}
              </TableCell>
              {/* <TableCell className="text-center">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 ">
                  {w.users.map((u) => (
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
              </TableCell> */}

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
                          <Link href={`/admin/roles/${w.id}/edit`}>
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
