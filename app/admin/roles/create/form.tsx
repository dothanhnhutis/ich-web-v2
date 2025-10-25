"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import PermissionComponent from "@/components/permission";
import { Button, buttonVariants } from "@/components/ui/button";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { type CreateRoleData, createRoleAction } from "@/data/role";
import { cn } from "@/lib/utils";

const DESCRIPTION_LENGTH = 225;

const CreateRoleForm = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateRoleData>({
    name: "",
    description: "",
    permissions: [],
  });
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createRoleAction(formData);
      if (res.statusCode === 200) {
        router.push("/admin/roles");
        toast.success(res.data.message);
      } else {
        setFormData({ name: "", description: "", permissions: [] });
        toast.error(res.data.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>Tạo vai trò mới</FieldLegend>
        <FieldDescription>
          Nhập tên và lựa chọn các quyền cho vai trò
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Tên vai trò</FieldLabel>

            <InputGroup>
              <InputGroupInput
                disabled={isPending}
                placeholder="Name"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name:
                      e.target.value.length <= 100 ? e.target.value : prev.name,
                  }))
                }
              />
              <InputGroupAddon align="inline-end">{`${formData.name.length} / 100`}</InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Mô tả về vai trò</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                disabled={isPending}
                id="description"
                placeholder="Enter your description"
                value={formData.description}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    description:
                      e.target.value.length <= DESCRIPTION_LENGTH
                        ? e.target.value
                        : prev.description,
                  }));
                }}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText className="text-muted-foreground text-xs">
                  {formData.description.length}/{DESCRIPTION_LENGTH}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel>Quyền truy cập</FieldLabel>
            <FieldDescription>
              Vai trò phải có một hoặc nhiều quyền truy cập.
            </FieldDescription>

            <PermissionComponent
              disabled={isPending}
              permissions={formData.permissions}
              onPermissionsChange={(permissions) =>
                setFormData((prev) => ({ ...prev, permissions }))
              }
            />
          </Field>

          <Field
            orientation="horizontal"
            className="justify-end flex-col sm:flex-row"
          >
            <Link
              href={"/admin/roles"}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto"
              )}
            >
              Huỷ
            </Link>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full sm:w-auto"
            >
              {isPending && <Spinner />}
              Tạo
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default CreateRoleForm;
