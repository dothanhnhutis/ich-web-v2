"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createWarehouseAction } from "@/data/warehouse/createWarehouseAction";
import {
  type UpdateWarehouseByIdFormData,
  updateWarehouseByIdAction,
} from "@/data/warehouse/updateWarehouseByIdAction";
import { cn } from "@/lib/utils";
import type { Warehouse } from "@/types/summary-types";

const WarehouseForm = ({ warehouse }: { warehouse?: Warehouse }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<
    Required<UpdateWarehouseByIdFormData>
  >({
    name: warehouse?.name ?? "",
    address: warehouse?.address ?? "",
    status: warehouse?.status ?? "ACTIVE",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const res = warehouse
        ? await updateWarehouseByIdAction(warehouse.id, formData)
        : await createWarehouseAction({
            name: formData.name,
            address: formData.address,
          });
      if (!res.success) throw new Error(res.message);
      return res.message;
    },
    onSuccess: async (message: string) => {
      router.push("/admin/warehouses");
      toast.success(message);

      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "warehouses" ||
          (!!warehouse &&
            query.queryKey[0] === "warehouses" &&
            query.queryKey[1] === warehouse.id),
      });
    },
    onError: (err: Error) => {
      setFormData({
        name: warehouse?.name ?? "",
        address: warehouse?.address ?? "",
        status: warehouse?.status ?? "ACTIVE",
      });
      toast.error(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Tạo nhà kho</FieldLegend>
        <FieldDescription>Nhập tên và địa chỉ cho nhà kho</FieldDescription>
        <FieldGroup>
          <div
            className={cn(
              "grid items-center gap-4",
              warehouse ? "sm:grid-cols-[7fr_3fr]" : ""
            )}
          >
            <Field>
              <FieldLabel htmlFor="name">Tên nhà kho</FieldLabel>
              <Input
                required
                id="name"
                type="name"
                placeholder="Nhập tên nhà kho..."
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </Field>
            {warehouse && (
              <Field>
                <FieldLabel>Trạng thái</FieldLabel>

                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={formData.status}
                  onValueChange={(value) => {
                    if (value !== "")
                      setFormData((prev) => ({ ...prev, status: value }));
                  }}
                >
                  <ToggleGroupItem
                    value="DISABLED"
                    aria-label="asc"
                    className="data-[state=on]:bg-destructive/10"
                  >
                    <p className="text-destructive">Vô hiệu hoá</p>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="ACTIVE"
                    aria-label="desc"
                    className="data-[state=on]:bg-green-500/10"
                  >
                    <p className="text-green-500">Hoạt động</p>
                  </ToggleGroupItem>
                </ToggleGroup>
              </Field>
            )}
          </div>

          <Field>
            <FieldLabel htmlFor="address">Địa chỉ nhà kho</FieldLabel>
            <Textarea
              required
              id="address"
              placeholder="Nhập địa chỉ nhà kho..."
              className="resize-none shadow-none"
              value={formData.address}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  address: e.target.value,
                }));
              }}
            />
          </Field>
          <Field orientation="responsive" dir="rtl">
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />} {warehouse ? "Lưu" : "Tạo"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={"/admin/warehouses"}>Trở về</Link>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default WarehouseForm;
