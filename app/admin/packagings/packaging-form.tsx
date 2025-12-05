"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageUpIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import ImageEditor from "@/components/ImageEditor";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createPackagingAction } from "@/data/packaging/createPackagingAction";
import { cn } from "@/lib/utils";

type PackagingFormData = {
  name: string;
  unit: "PIECE" | "CARTON";
  pcs_ctn: number;
  min_stock_level: number;
  status: string;
};

const PackagingForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<Required<PackagingFormData>>({
    name: "",
    unit: "PIECE",
    pcs_ctn: 0,
    min_stock_level: 0,
    status: "ACTIVE",
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const res = await createPackagingAction(
        formData.unit === "CARTON"
          ? {
              name: formData.name,
              unit: formData.unit,
              pcs_ctn: formData.pcs_ctn,
              min_stock_level:
                formData.min_stock_level === 0
                  ? undefined
                  : formData.min_stock_level,
            }
          : {
              name: formData.name,
              unit: formData.unit,
              min_stock_level:
                formData.min_stock_level === 0
                  ? undefined
                  : formData.min_stock_level,
            }
      );
      if (!res.success) throw new Error(res.message);
      return res.message;
    },
    onSuccess: async (message: string) => {
      router.push("/admin/packagings");
      toast.success(message);

      // await queryClient.invalidateQueries({
      //   predicate: (query) =>
      //     query.queryKey[0] === "packagings" ||
      //     (!!warehouse &&
      //       query.queryKey[0] === "packagings" &&
      //       query.queryKey[1] === warehouse.id),
      // });
    },
    onError: (err: Error) => {
      setFormData({
        name: "",
        unit: "PIECE",
        pcs_ctn: 0,
        min_stock_level: 0,
        status: "ACTIVE",
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
        <FieldLegend>Tạo bao bì</FieldLegend>
        <FieldDescription>Điền đầy đủ các thông tin bên dưới.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Hình ảnh</FieldLabel>

            <ImageEditor
              multiple
              accept="image/jpeg, image/png, image/jpg"
              title="Chỉnh sửa hình ảnh"
              cropShape="round"
              description="Chỉnh sửa hình ảnh bao bì"
              aspectRatioList={["1 : 1", "16 : 9", "3 : 4"]}
              onSaveImage={(files) => {
                console.log(files);
                console.log(URL.createObjectURL(files[0]));
              }}
            >
              <Empty className="border-2 hover:border-primary">
                <EmptyHeader className="gap-1">
                  <EmptyMedia>
                    <ImageUpIcon className="size-12" />
                  </EmptyMedia>
                  <EmptyTitle>Tải hình ảnh</EmptyTitle>
                  <EmptyDescription>asdasd</EmptyDescription>
                </EmptyHeader>
                <EmptyContent></EmptyContent>
              </Empty>
            </ImageEditor>
          </Field>
          <div
            className={cn(
              "grid items-center gap-4",
              false ? "sm:grid-cols-3" : ""
            )}
          >
            <Field className={false ? "col-span-2" : ""}>
              <FieldLabel htmlFor="name">Tên bao bì</FieldLabel>
              <Input
                required
                id="name"
                type="text"
                placeholder="Nhập tên bao bì..."
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                }}
              />
            </Field>
            {false && (
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="address">Đơn vị lưu trữ</FieldLabel>
              <Select
                value={formData.unit}
                onValueChange={(v) => {
                  console.log(v);
                  setFormData((prev) => ({
                    ...prev,
                    unit: v as PackagingFormData["unit"],
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Đơn vị lưu trữ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Đơn vị lưu trữ</SelectLabel>
                    <SelectItem value="CARTON">Thùng</SelectItem>
                    <SelectItem value="PIECE">Cái</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {formData.unit === "CARTON" && (
              <Field>
                <FieldLabel htmlFor="address">Quy cách</FieldLabel>
                <Input
                  type="number"
                  min={0}
                  required
                  id="name"
                  placeholder="Nhập quy cách..."
                  value={formData.pcs_ctn}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      pcs_ctn: Number(e.target.value),
                    }));
                  }}
                />
                <FieldDescription>
                  Số lượng bao bì trong một thùng.
                </FieldDescription>
              </Field>
            )}
            <Field
              className={cn(
                formData.unit === "CARTON" ? "col-span-1" : "col-span-2"
              )}
            >
              <FieldLabel htmlFor="address">Mức tồn kho tối thiểu</FieldLabel>
              <Input
                type="number"
                min={0}
                required
                id="name"
                placeholder="Nhập mức tồn kho tối thiểu..."
                value={formData.min_stock_level}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    min_stock_level: Number(e.target.value),
                  }));
                }}
              />
              <FieldDescription>
                Cảnh báo khi tồn kho ở mức thấp.
              </FieldDescription>
            </Field>
          </div>

          <Field orientation="responsive" dir="rtl">
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner />} {false ? "Lưu" : "Tạo"}
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

export default PackagingForm;
