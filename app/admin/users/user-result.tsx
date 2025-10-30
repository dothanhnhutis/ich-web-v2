"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import PageComponent from "@/components/page";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/components/user-context";
import { queryUsersAction } from "@/data/user";
import { buildSortField, cn, hasDuplicateKey } from "@/lib/utils";
import UserFilter from "./user-filter";
import UserTable from "./user-table";
import UserView from "./user-view";

const LoadingData = () => {
  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto ">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right w-[130px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-30 h-3 rounded-full" />
                        <Skeleton className="w-20 h-2 rounded-full" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-12 h-3 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-12 h-3 rounded-full" />
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

const accessSearchParamKeys: string[] = [
  "username",
  "email",
  "status",
  "sort",
  "page",
  "limit",
];

const sortRoleEnum = buildSortField([
  "username",
  "email",
  "status",
  "deactived_at",
  "created_at",
  "updated_at",
]);

const UserResult = () => {
  const { hasPermission } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [viewId, setViewId] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: () => queryUsersAction(searchParams.toString()),
    // staleTime: 10_000, // 10s trước khi refetch tự động
    placeholderData: keepPreviousData, // giữ dữ liệu cũ khi searchParams thay đổi
  });

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

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản lý người dùng</h3>

          {hasPermission("create:user") ? (
            <Link
              href="/admin/users/create"
              className={cn(
                buttonVariants({ variant: "default" }),
                "text-white"
              )}
            >
              <span className="hidden xs:inline ">Tạo người dùng mới</span>
              <PlusIcon className="w-4 h-4 shrink-0" />
            </Link>
          ) : null}
        </div>
        <UserFilter />
        {isLoading || !data ? (
          <LoadingData />
        ) : (
          <div className="outline-none relative flex flex-col gap-4 overflow-auto ">
            <div className="overflow-hidden rounded-lg border">
              <div className="relative w-full overflow-x-auto">
                <UserTable
                  users={data.users}
                  onViewUser={(userId) => {
                    setViewId(userId);
                  }}
                  //   onResetUserPassword={(userId: string) => {
                  //     setDeleteRoleId(userId);
                  //     setOpen(true);
                  //   }}
                />
              </div>
            </div>
            {data.users.length > 0 && (
              <PageComponent metadata={data.metadata} />
            )}
          </div>
        )}
      </div>
      <UserView
        id={viewId}
        open={!!viewId}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setViewId(null);
          }
        }}
      />
    </div>
  );
};

export default UserResult;
