"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dice1, ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";
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
import { cn, convertImage } from "@/lib/utils";
import type { Packaging } from "@/types/summary-types";

type PackagingFormData = {
  name: string;
  unit: "PIECE" | "CARTON";
  pcs_ctn: number;
  min_stock_level: number;
  status: string;
};

const PackagingForm = ({ packaging }: { packaging?: Packaging }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [packagingImg, setPackagingImg] = React.useState<File | null>(null);
  const [imageURL, setImageURL] = React.useState<string | null>(
    packaging?.image ? convertImage(packaging.image).url : null
  );

  const [formData, setFormData] = React.useState<Required<PackagingFormData>>({
    name: packaging?.name ?? "",
    unit: packaging?.unit ?? "PIECE",
    pcs_ctn: packaging?.pcs_ctn ?? 0,
    min_stock_level: packaging?.min_stock_level ?? 0,
    status: packaging?.status ?? "ACTIVE",
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
              file: packagingImg,
            }
          : {
              name: formData.name,
              unit: formData.unit,
              min_stock_level:
                formData.min_stock_level === 0
                  ? undefined
                  : formData.min_stock_level,
              file: packagingImg,
            }
      );
      if (!res.success) throw new Error(res.message);

      return res.message;
    },
    onSuccess: async (message: string) => {
      router.push("/admin/packagings");
      toast.success(message);

      await queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "packagings" ||
          (!!packaging &&
            query.queryKey[0] === "packagings" &&
            query.queryKey[1] === packaging.id),
      });
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

  React.useEffect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  });

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>{packaging ? "" : "Tạo bao bì"}</FieldLegend>
        <FieldDescription>Điền đầy đủ các thông tin bên dưới.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Hình ảnh</FieldLabel>
            <div className="flex">
              {imageURL ? (
                <div className="relative overflow-hidden rounded-md  bg-foreground/30">
                  <Image
                    src={imageURL}
                    width={200}
                    height={200}
                    alt="image"
                    className="size-[200px] object-contain"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-background/20 rounded-full"
                    onClick={() => {
                      setPackagingImg(null);
                      URL.revokeObjectURL(imageURL);
                      setImageURL(null);
                    }}
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <ImageEditor
                  accept="image/jpeg, image/png, image/jpg"
                  title="Chỉnh sửa hình ảnh"
                  description="Chỉnh sửa hình ảnh bao bì"
                  aspectRatioList={[
                    "1 : 1",
                    "9 : 16",
                    "16 : 9",
                    "3 : 4",
                    "4 : 3",
                  ]}
                  onSaveImage={(files) => {
                    if (files[0]) {
                      setPackagingImg(files[0]);
                      setImageURL(URL.createObjectURL(files[0]));
                    }
                  }}
                >
                  <Empty className="border-2 hover:border-primary md:p-0 size-[200px]">
                    <EmptyHeader className="gap-1">
                      <EmptyMedia>
                        <ImageUpIcon className="size-12" />
                      </EmptyMedia>
                      <EmptyTitle>Tải hình ảnh</EmptyTitle>
                      <EmptyDescription></EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </ImageEditor>
              )}
            </div>
          </Field>
          <div
            className={cn(
              "grid items-center gap-4",
              packaging ? "sm:grid-cols-3" : ""
            )}
          >
            <Field className={packaging ? "col-span-2" : ""}>
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
            {packaging && (
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

          <div
            className={cn(
              "grid gap-4",
              formData.unit === "CARTON" ? " sm:grid-cols-3" : " sm:grid-cols-2"
            )}
          >
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
            <Field>
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
              {isPending && <Spinner />} {packaging ? "Cập nhật" : "Tạo"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={"/admin/packaging"}>Trở về</Link>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default PackagingForm;
