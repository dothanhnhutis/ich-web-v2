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
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import type { Role } from "@/data/role";
import { cn } from "@/lib/utils";

const DESCRIPTION_LENGTH = 225;

type UpdateRoleData = {
  name: string;
  description: string;
  permissions: string[];
  status: string;
};

const UpdateRoleForm = ({ role }: { role: Role }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState<UpdateRoleData>({
    name: role.name,
    description: role.description,
    permissions: role.permissions,
    status: role.status,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {});
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
            <Input
              disabled={isPending}
              id="name"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
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
            <FieldLabel>Quyền</FieldLabel>
            <FieldDescription>Chọn quyền cho vai trò.</FieldDescription>
            <PermissionComponent
              disabled={isPending}
              permissions={formData.permissions}
              onPermissionsChange={(permissions) =>
                setFormData((prev) => ({ ...prev, permissions }))
              }
            />
          </Field>
          <Field orientation="horizontal" className="justify-end">
            <Link
              href={"/admin/roles"}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Huỷ
            </Link>
            <Button disabled={isPending} type="submit">
              {isPending && <Spinner />}
              Cập nhật
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default UpdateRoleForm;
