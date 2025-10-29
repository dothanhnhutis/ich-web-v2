"use client";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/components/user-context";
import { deleteRoleByIdAction, queryRolesAction } from "@/data/role";
import { buildSortField, cn, hasDuplicateKey } from "@/lib/utils";
import RoleFilter from "./role-filter";
import RoleTable from "./role-table";
import RoleView from "./role-view";

const accessSearchParamKeys: string[] = [
  "name",
  "permissions",
  "description",
  "status",
  "sort",
  "page",
  "limit",
];

const sortRoleEnum = buildSortField([
  "name",
  "permissions",
  "description",
  "status",
  "created_at",
  "updated_at",
]);

const RoleLoading = () => {
  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start w-[200px]">
                  Tên vai trò
                </TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center w-[130px]">
                  Tài khoản
                </TableHead>
                <TableHead className="text-right w-[130px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">
                    <Skeleton className="w-12 h-3 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-80 h-3 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="w-12 h-3 inline-block" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-9 h-3 inline-block" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center text-sm @container">
        <Skeleton className="shrink-0 hidden @2xl:block h-3 w-20" />

        <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
          <div className="@2xl:flex gap-2 items-center hidden">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-[70px]" />
          </div>

          <Skeleton className="h-3 w-20 @2xl:hidden" />

          <div className="flex items-center gap-2 @2xl:hidden">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
          <Pagination className="w-auto mx-0 hidden @2xl:flex">
            <PaginationContent>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className="h-9 w-9" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

const RoleResult = () => {
  const { hasPermission } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const [viewId, setViewId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["roles", searchParams.toString()],
    queryFn: () => queryRolesAction(searchParams.toString()),
    staleTime: 10_000, // 10s trước khi refetch tự động
    placeholderData: keepPreviousData, // giữ dữ liệu cũ khi searchParams thay đổi
  });

  const [open, setOpen] = React.useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = React.useState<string | null>(null);
  const [isPending1, startTransition1] = React.useTransition();
  const handleDeleteRole = () => {
    startTransition1(async () => {
      if (deleteRoleId) {
        const res = await deleteRoleByIdAction(deleteRoleId);
        if (res.success) {
          toast.success(res.message);
          await queryClient.invalidateQueries({ queryKey: ["roles"] });
        } else {
          toast.error(res.message);
        }
        setOpen(false);
        setDeleteRoleId(null);
      }
    });
  };

  React.useEffect(() => {
    const validateSearchParams = () => {
      // Kiểm tra khóa không hợp lệ
      const invalidKey = Array.from(searchParams.keys()).some(
        (k) => !accessSearchParamKeys.includes(k)
      );

      // Các key chỉ được có 1 giá trị
      const multiValueKeys = ["name", "description", "status", "page", "limit"];
      const hasMultipleValues = multiValueKeys.some(
        (key) => searchParams.getAll(key).length > 1
      );

      // Kiểm tra giá trị sort không hợp lệ
      const invalidSortValue = searchParams
        .getAll("sort")
        .some((v) => !sortRoleEnum.includes(v));

      // Kiểm tra trùng sort key
      const hasDuplicateSort = hasDuplicateKey(searchParams.getAll("sort"));

      // Không được có cả email & username cùng lúc
      const hasNameAndDescription =
        searchParams.has("name") && searchParams.has("description");

      return (
        invalidKey ||
        hasMultipleValues ||
        invalidSortValue ||
        hasDuplicateSort ||
        hasNameAndDescription
      );
    };

    const buildValidSearchParams = () => {
      const newParams = new URLSearchParams();

      for (const [key, value] of searchParams.entries()) {
        if (!accessSearchParamKeys.includes(key)) continue;

        if (key === "sort") {
          if (!sortRoleEnum.includes(value)) continue;

          const values = newParams.getAll(key);
          const [sortType] = value.split(".");
          const existing = values.find((v) => v.startsWith(sortType));
          if (existing) newParams.delete(key, existing);
          newParams.append(key, value);
        } else {
          newParams.set(key, value);
          // Không để tồn tại cả name & description
          const opposite = key === "name" ? "description" : "name";
          if (newParams.has(opposite)) newParams.delete(opposite);
        }
      }

      return newParams;
    };

    if (validateSearchParams()) {
      const newParams = buildValidSearchParams();
      const newUrl = `${pathName}?${newParams.toString()}`;
      if (newUrl !== `${pathName}?${searchParams.toString()}`) {
        router.push(newUrl);
      }
    }
  }, [searchParams, router, pathName]);

  const handleClose = () => {
    setViewId(null);
  };
  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản lý vai trò </h3>

          {hasPermission("create:role") ? (
            <Link
              href="/admin/roles/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "text-white"
              )}
            >
              <span className="hidden xs:inline ">Tạo vai trò mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          ) : null}
        </div>

        <RoleFilter />

        {isLoading || !data ? (
          <RoleLoading />
        ) : (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <RoleTable
                  roles={data.roles}
                  onViewRole={(id) => {
                    setViewId(id);
                  }}
                  onDeleteRole={(userId: string) => {
                    setDeleteRoleId(userId);
                    setOpen(true);
                  }}
                />
              </div>
            </div>
            {data.roles.length > 0 && (
              <PageComponent metadata={data.metadata} />
            )}
          </div>
        )}
      </div>
      <RoleView id={viewId} onClose={handleClose} />
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
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <Button
              disabled={isPending1}
              variant={"destructive"}
              onClick={handleDeleteRole}
            >
              {isPending1 && <Spinner />}
              Xoá
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleResult;
