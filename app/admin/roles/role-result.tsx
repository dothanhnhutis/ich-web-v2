"use client";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import PageComponent from "@/components/page";
import { buttonVariants } from "@/components/ui/button";
import { queryRolesAction } from "@/data/role";
import { buildSortField, cn, hasDuplicateKey } from "@/lib/utils";
import RoleTable from "./table-data";

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

const RoleResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [enabled, setEnabled] = React.useState<boolean>(false);

  // dam bao thu tu searchParams key
  const { data } = useQuery({
    enabled,
    queryKey: ["roles", searchParams.toString()],
    queryFn: async () => await queryRolesAction(),
  });

  React.useEffect(() => {
    setEnabled(false);
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
    } else {
      setEnabled(true);
    }
  }, [searchParams, router, pathName]);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col gap-4 p-4 mx-auto max-w-5xl">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="text-2xl font-bold shrink-0">Quản vai trò </h3>
          <Link
            href="/admin/roles/create"
            className={cn(buttonVariants({ variant: "link" }))}
          >
            <span className="hidden xs:inline">Tạo vai trò mới</span>
            <PlusIcon className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        {/* <div className="outline-none relative flex flex-col gap-4 overflow-auto">
          <div className="overflow-hidden rounded-lg border">
            <div className="relative w-full overflow-x-auto">
              <RoleTable roles={} />
            </div>
          </div>
          <PageComponent metadata={metadata} />
        </div> */}
      </div>
    </div>
  );
};

export default RoleResult;
