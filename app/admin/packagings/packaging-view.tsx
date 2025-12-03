import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CopyIcon, HashIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import Pagination from "@/components/page1";
import SortModal from "@/components/sort-modal";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { sortPackagingByWarehouseIdData } from "@/constants";
import { findPackagingByIdAction } from "@/data/packaging/findPackagingByIdAction";
import { findWarehousesByPackagingIdAction } from "@/data/packaging/findWarehousesByPackagingIdAction";
import { cn } from "@/lib/utils";

type PackagingViewProps = React.ComponentProps<typeof Sheet> & {
  id: string | null;
};
const PackagingView = ({ id, children, ...props }: PackagingViewProps) => {
  const [searchName, setSearchName] = React.useState<string>("");
  const [warehouseSearchParams, setPackagingSearchParams] =
    React.useState<string>("limit=10&page=1");

  const { data: packaging, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ["packagings", id],
    queryFn: () => findPackagingByIdAction(id ?? ""),
  });

  const { data: warehousesData, isLoading: isLoading1 } = useQuery({
    enabled: !!id,
    queryKey: ["packagings", id, "warehouses", warehouseSearchParams],
    queryFn: () =>
      findWarehousesByPackagingIdAction(id ?? "", warehouseSearchParams),
  });

  return (
    <Sheet {...props}>
      <SheetContent className="w-full xs:max-w-md sm:max-w-md gap-0 h-screen flex flex-col overflow-y-scroll">
        <SheetHeader className="border-b py-1 gap-0">
          <SheetTitle className="flex items-center gap-2 max-w-[calc(100%_-_24px)]">
            <HashIcon className="shrink-0 w-5 h-5" />
            {!isLoading ? (
              <>
                <p className="truncate">{id}</p>
                <CopyIcon className="shrink-0 w-4 h-4" />
              </>
            ) : (
              <Skeleton className="h-3 w-40" />
            )}
          </SheetTitle>
          <SheetDescription>Chi tiết bao bì</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-4 flex-1">
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Tên bao bì</Label>
              {!isLoading ? (
                <p className="line-clamp-2">{packaging?.name ?? "--"}</p>
              ) : (
                <>
                  <Skeleton className="w-50 h-3" />
                  <Skeleton className="w-40 h-3" />
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <Label className="text-muted-foreground">Trạng thái</Label>
              {!isLoading ? (
                <p
                  className={cn(
                    "font-bold",
                    packaging
                      ? packaging?.status === "ACTIVE"
                        ? "text-green-500"
                        : "text-destructive"
                      : ""
                  )}
                >
                  {packaging
                    ? packaging.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Vô hiệu hoá"
                    : "--"}
                </p>
              ) : (
                <Skeleton className="w-20 h-3" />
              )}
            </div>
          </div>
          <div className="flex justify-between gap-2 text-center">
            <div>
              <Label className="text-muted-foreground">Số lượng</Label>
              {!isLoading ? (
                <p>{!packaging ? "--" : packaging.total_quantity}</p>
              ) : (
                <Skeleton className="w-10 h-3 mx-auto mt-2" />
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">
                Mức tồn kho tối thiểu
              </Label>
              {!isLoading ? (
                <p>
                  {!packaging?.min_stock_level
                    ? "--"
                    : packaging.min_stock_level}
                </p>
              ) : (
                <Skeleton className="w-10 h-3 mx-auto mt-2" />
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">Đơn vị lưu trữ</Label>
              {!isLoading ? (
                <p>
                  {!packaging
                    ? "--"
                    : packaging.unit === "CARTON"
                    ? "Thùng"
                    : "Cái"}
                </p>
              ) : (
                <Skeleton className="w-10 h-3 mx-auto mt-2" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Ngày vô hiệu hoá</Label>
            {!isLoading ? (
              <p>
                {packaging?.disabled_at
                  ? format(
                      new Date(packaging.disabled_at).toISOString(),
                      "EEEE, dd/MM/yy HH:mm:ss",
                      {
                        locale: vi,
                      }
                    )
                  : "--"}
              </p>
            ) : (
              <Skeleton className="w-60 h-3" />
            )}
          </div>

          <Separator orientation="horizontal" className="" />

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Nhà kho</Label>

            <div className="flex flex-col gap-2">
              {isLoading ? (
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-9 w-full rounded-sm" />
                  <Skeleton className="h-9 w-10.5 rounded-sm" />
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <InputGroup>
                    <InputGroupInput
                      type="text"
                      placeholder="Tên bao bì..."
                      value={searchName}
                      onChange={(e) => {
                        setSearchName(e.target.value);
                        if (e.target.value === "") {
                          const newSearchParams = new URLSearchParams(
                            warehouseSearchParams
                          );
                          newSearchParams.delete("name");
                          newSearchParams.sort();
                          setPackagingSearchParams(newSearchParams.toString());
                        }
                      }}
                    />

                    <InputGroupAddon
                      align="inline-end"
                      className={cn(
                        "p-0",
                        searchName.length === 0 ? "hidden" : "block"
                      )}
                    >
                      <button
                        type="button"
                        className="p-2"
                        onClick={() => {
                          setSearchName("");
                          const newSearchParams = new URLSearchParams(
                            warehouseSearchParams
                          );
                          newSearchParams.delete("name");
                          newSearchParams.sort();
                          setPackagingSearchParams(newSearchParams.toString());
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
                          if (searchName !== "") {
                            const newSearchParams = new URLSearchParams(
                              warehouseSearchParams
                            );
                            newSearchParams.set("name", searchName);
                            newSearchParams.sort();
                            setPackagingSearchParams(
                              newSearchParams.toString()
                            );
                          }
                        }}
                      >
                        <SearchIcon />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <SortModal
                    data={sortPackagingByWarehouseIdData}
                    searchParamsString={warehouseSearchParams}
                    onSortChange={setPackagingSearchParams}
                  />
                </div>
              )}

              {isLoading || isLoading1 ? (
                <div className="flex flex-col gap-2 ">
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((id) => (
                    <div key={id} className="flex gap-2">
                      <div>
                        <Skeleton className="size-[80px] rounded-sm" />
                      </div>

                      <div className="space-y-2 w-full">
                        <h4 className="font-semibold line-clamp-2 space-y-1">
                          <Skeleton className="w-60 h-3" />
                          <Skeleton className="w-70 h-3" />
                        </h4>

                        <div className="flex gap-1 justify-between text-muted-foreground text-xs">
                          <Skeleton className="w-30 h-2" />
                          <Skeleton className="w-20 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    "flex flex-col gap-2  overflow-auto",
                    warehousesData && warehousesData.warehouses.length > 3
                      ? "max-h-[calc(100vh_-_452px)] min-h-[264px]"
                      : "h-auto"
                  )}
                >
                  {warehousesData?.warehouses.map((w) => (
                    <div key={w.id} className="flex gap-2">
                      <div className="space-y-1 w-full">
                        <h4 className="line-clamp-2">
                          {w.disabled_at && (
                            <Badge
                              variant={"destructive"}
                              className="rounded-sm mr-1"
                            >
                              Vô hiệu hoá
                            </Badge>
                          )}
                          {w.name}
                        </h4>

                        <div className="flex gap-1 text-muted-foreground text-sm">
                          <p className="w-full">{w.address}</p>
                          <p className="shrink-0">Số lượng: {w.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination
                metadata={isLoading ? undefined : warehousesData?.metadata}
                searchParamsString={warehouseSearchParams}
                onPageChange={(v) => setPackagingSearchParams(v)}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row border-t">
          {!isLoading ? (
            <Link
              href={`/admin/warehouses/${packaging?.id}/edit`}
              className={cn("w-full", buttonVariants({ variant: "outline" }))}
            >
              Chỉnh Sửa
            </Link>
          ) : (
            <Skeleton className="w-full h-9" />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PackagingView;
