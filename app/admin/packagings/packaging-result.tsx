"use client";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import PageComponent from "@/components/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/components/user-context";
import { deletePackagingByIdAction } from "@/data/packaging/deleteWarehouseByIdAction";
import { findManyPackagingAction } from "@/data/packaging/findManyPackagingAction";
import { cn } from "@/lib/utils";
import WarehouseTable from "../warehouses/warehouse-table";
import PackagingTable from "./packaging-table";
import PackagingView from "./packaging-view";

const PackagingResult = () => {
  const { hasPermission } = useUser();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState<boolean>(false);
  const [deleteWarehouseId, setDeleteWarehouseId] = React.useState<
    string | null
  >(null);
  const [viewId, setViewId] = React.useState<string | null>(null);

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
    queryKey: ["packagings", newSearchParams.toString()],
    queryFn: () => findManyPackagingAction(newSearchParams.toString()),
    // staleTime: 10_000, // 10s trước khi refetch tự động
    placeholderData: keepPreviousData, // giữ dữ liệu cũ khi searchParams thay đổi
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (warehouseId: string) => {
      const res = await deletePackagingByIdAction(warehouseId);
      if (!res.success) throw new Error(res.message);
      await queryClient.invalidateQueries({ queryKey: ["packagings"] });
      return res.message;
    },
    onSuccess: (message: string) => {
      toast.success(message);
    },
    onError: (message: string) => {
      toast.error(message);
    },
    onSettled: () => {
      setOpen(false);
      setDeleteWarehouseId(null);
    },
  });

  const handleDeleteRole = () => {
    if (deleteWarehouseId) {
      mutate(deleteWarehouseId);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản lý bao bì</h3>
          {hasPermission("create:packaging") ? (
            <Link
              href="/admin/packagings/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "text-white"
              )}
            >
              <span className="hidden xs:inline">Tạo nhà bao bì mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          ) : null}
        </div>

        {/* <WarehouseFilter /> */}

        {data && (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <PackagingTable
                  packagings={data.packagings}
                  onViewPackaging={(id) => {
                    setViewId(id);
                  }}
                  onDeletePackaging={(userId: string) => {
                    setDeleteWarehouseId(userId);
                    setOpen(true);
                  }}
                />
              </div>
            </div>
            {data.packagings.length > 0 && (
              <PageComponent metadata={data.metadata} />
            )}
          </div>
        )}
      </div>

      <PackagingView
        id={viewId}
        open={!!viewId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewId(null);
          }
        }}
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
              vai trò khỏi máy chủ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không, giữ nó lại</AlertDialogCancel>
            <Button
              disabled={isPending}
              variant={"destructive"}
              onClick={handleDeleteRole}
            >
              {isPending && <Spinner />}
              Có, xoá đi
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PackagingResult;
