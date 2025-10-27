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
import type { Role } from "@/data/role";
import { cn } from "@/lib/utils";
import UserTable from "./user-table";

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
        <FieldLegend>Cập nhật vai trò</FieldLegend>
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
            <FieldLabel htmlFor="description">Mô tả</FieldLabel>
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

          <Field>
            <FieldLabel>Tài khoản</FieldLabel>
            <FieldDescription>
              Chọn tài khoản muốn cấp quyền này
            </FieldDescription>
            <UserTable roleId={role.id} />
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
              Cập nhật
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
};

export default UpdateRoleForm;
