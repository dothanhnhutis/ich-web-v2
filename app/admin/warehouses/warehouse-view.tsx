import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CopyIcon, HashIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Pagination from "@/components/page1";
import SortModal from "@/components/sort-modal";
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
import { findPackagingsByWarehouseIdAction } from "@/data/warehouse/findPackagingsByWarehouseIdAction";
import { findWarehouseByIdAction } from "@/data/warehouse/findWarehouseByIdAction";
import { cn, convertImage } from "@/lib/utils";

type WarehouseViewProps = React.ComponentProps<typeof Sheet> & {
  id: string | null;
};
const WarehouseView = ({ id, children, ...props }: WarehouseViewProps) => {
  const [searchName, setSearchName] = React.useState<string>("");
  const [packagingSearchParams, setPackagingSearchParams] =
    React.useState<string>("page=1&limit=10");

  const { data: warehouse, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ["warehouses", id],
    queryFn: () => findWarehouseByIdAction(id ?? ""),
  });

  const { data: packagingsData, isLoading: isLoading1 } = useQuery({
    enabled: !!id,
    queryKey: ["warehouses", id, "packagings", packagingSearchParams],
    queryFn: () =>
      findPackagingsByWarehouseIdAction(id ?? "", packagingSearchParams),
  });

  return (
    <Sheet {...props}>
      <SheetContent className="w-full xs:max-w-md sm:max-w-md gap-0 h-screen flex flex-col overflow-y-scroll">
        <SheetHeader className=" border-b py-1 gap-0">
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
          <SheetDescription>Chi tiết nhà kho</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4 flex-1">
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">Tên nhà kho</Label>
              {!isLoading ? (
                <p className="line-clamp-2">{warehouse?.name ?? "--"}</p>
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
                    warehouse
                      ? warehouse?.status === "ACTIVE"
                        ? "text-green-500"
                        : "text-destructive"
                      : ""
                  )}
                >
                  {warehouse
                    ? warehouse.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Vô hiệu hoá"
                    : "--"}
                </p>
              ) : (
                <Skeleton className="w-20 h-3" />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Địa chỉ</Label>
            {!isLoading ? (
              <p className="line-clamp-2">
                {!warehouse || warehouse.address === ""
                  ? "--"
                  : warehouse.address}
              </p>
            ) : (
              <>
                <Skeleton className="w-80 h-3" />
                <Skeleton className="w-96 h-3" />
              </>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Ngày vô hiệu hoá</Label>
            {!isLoading ? (
              <p>
                {warehouse?.disabled_at
                  ? format(
                      new Date(warehouse.disabled_at).toISOString(),
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

          <Separator orientation="horizontal" className="my-2" />

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Bao bì</Label>

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
                            packagingSearchParams
                          );
                          newSearchParams.delete("name");
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
                            packagingSearchParams
                          );
                          newSearchParams.delete("name");
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
                              packagingSearchParams
                            );
                            newSearchParams.set("name", searchName);
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
                    data={{ name: { title: "name", description: "--" } }}
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
                <div className="flex flex-col gap-2 max-h-[calc(100vh_-_452px)] overflow-auto">
                  {packagingsData?.packagings.map((p) => (
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
                        <h4 className="line-clamp-2">{p.name}</h4>
                        {p.unit === "CARTON" ? (
                          <div className="flex gap-1 text-muted-foreground text-sm">
                            <p className="w-full">
                              Số lượng: {p.quantity} thùng
                            </p>
                            <p className="shrink-0">
                              Quy cách: {p.pcs_ctn} / Thùng
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            Số lượng: {p.quantity} cái
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination
                metadata={isLoading ? undefined : packagingsData?.metadata}
                searchParamsString={packagingSearchParams}
                onPageChange={(v) => setPackagingSearchParams(v)}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row border-t">
          {!isLoading ? (
            <Link
              href={`/admin/warehouses/${warehouse?.id}/edit`}
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

export default WarehouseView;
