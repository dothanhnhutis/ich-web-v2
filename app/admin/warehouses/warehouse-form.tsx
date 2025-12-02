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
import {
  type CreateWarehouseFormData,
  createWarehouseAction,
} from "@/data/warehouse/createWarehouseAction";
import { updateWarehouseByIdAction } from "@/data/warehouse/updateWarehouseById";
import type { Warehouse } from "@/types/summary-types";

const WarehouseForm = ({ warehouse }: { warehouse?: Warehouse }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<CreateWarehouseFormData>({
    name: warehouse?.name ?? "",
    address: warehouse?.address ?? "",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const res = warehouse
        ? await updateWarehouseByIdAction(warehouse.id, formData)
        : await createWarehouseAction(formData);
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
          <Field>
            <FieldLabel htmlFor="address">Địa chỉ nhà kho</FieldLabel>
            <Textarea
              required
              id="address"
              placeholder="Nhập địa chỉ nhà kho..."
              value={formData.address}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, address: e.target.value }));
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
