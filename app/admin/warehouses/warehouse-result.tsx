"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import PageComponent from "@/components/page";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/components/user-context";
import { findManyWarehouseAction } from "@/data/warehouse/findManyWarehouseAction";
import { cn } from "@/lib/utils";
import WarehouseTable from "./warehouse-table";

const WarehouseResult = () => {
  const { hasPermission } = useUser();
  const searchParams = useSearchParams();

  const newSearchParams = React.useMemo(() => {
    const result = new URLSearchParams(searchParams.toString());
    if (!result.has("limit")) {
      result.set("limit", "10");
    }
    if (!result.has("page")) {
      result.set("page", "1");
    }
    return result;
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["roles", newSearchParams.toString()],
    queryFn: () => findManyWarehouseAction(newSearchParams.toString()),
    // staleTime: 10_000, // 10s trước khi refetch tự động
    placeholderData: keepPreviousData, // giữ dữ liệu cũ khi searchParams thay đổi
  });

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản lý nhà kho </h3>

          {hasPermission("create:role") ? (
            <Link
              href="/admin/roles/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "text-white"
              )}
            >
              <span className="hidden xs:inline ">Tạo nhà kho mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          ) : null}
        </div>

        {data && (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <WarehouseTable
                  warehouses={data.warehouses}
                  onViewWarehouse={(id) => {
                    // setViewId(id);
                  }}
                  onDeleteWarehouse={(userId: string) => {
                    // setDeleteRoleId(userId);
                    // setOpen(true);
                  }}
                />
              </div>
            </div>
            {data.warehouses.length > 0 && (
              <PageComponent metadata={data.metadata} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseResult;
