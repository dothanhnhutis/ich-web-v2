"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { queryRolesAction, type Role } from "@/data/role";
import type { UserDetail } from "@/data/user";
import { cn, convertImage, getShortName } from "@/lib/utils";

type FormData = {
  email: string;
  username: string;
  status: string;
  roleIds: string[];
};

const UpdateUserForm = ({ user }: { user: UserDetail }) => {
  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    username: "",
    status: "ACTIVE",
    roleIds: [],
  });

  React.useEffect(() => {
    setFormData({
      email: user.email,
      username: user.username,
      roleIds: user.roles.map(({ id }) => id),
      status: user.status,
    });
  }, [user]);

  const { data, isLoading } = useQuery({
    queryKey: ["roles", "created_at.desc"],
    queryFn: () => queryRolesAction([["sort", "created_at.desc"]]),
    placeholderData: keepPreviousData,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => {},
    onSuccess: () => {},
    onError: () => {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Cập nhật người dùng</FieldLegend>
          <FieldDescription>Cập nhật thông tin cho tài khoản.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Thông tin tài khoản</FieldLabel>
              <div className="flex gap-4 flex-auto">
                <Avatar className="size-14 group-hover:hidden bg-white">
                  <AvatarImage
                    src={
                      user?.avatar
                        ? convertImage(user.avatar).url
                        : "/images/logo-square.png"
                    }
                    alt={user?.avatar?.file_name || user?.username}
                  />
                  <AvatarFallback>
                    {user?.username ? getShortName(user.username) : "ICH"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-0.5">
                  <p className="font-bold text-lg xs:text-xl">
                    {user.username}
                  </p>
                  <p className="text-sm xs:text-base">{user.email}</p>
                </div>
              </div>
            </Field>
            <div className="grid items-center gap-4 sm:grid-cols-[7fr_3fr]">
              <Field>
                <FieldLabel
                  htmlFor="username"
                  className="block after:ml-0.5 after:text-red-500 after:content-['*']"
                >
                  Họ và tên
                </FieldLabel>
                <Input
                  id="username"
                  placeholder="Nguyễn Văn A"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </Field>
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
                    value="INACTIVE"
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
            </div>
            <Field>
              <FieldLabel htmlFor="">Vai trò</FieldLabel>
              <FieldDescription>
                Chọn vai trò cho tài khoản người dùng <b>(có thể chọn nhiều)</b>
              </FieldDescription>
              {data?.roles ? (
                <ItemGroup>
                  {data.roles.map((role, index) => (
                    <React.Fragment key={role.id}>
                      <Item className="px-0">
                        <ItemContent className="gap-1">
                          <ItemTitle>{role.name}</ItemTitle>
                          <ItemDescription>{role.description}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Switch
                            checked={formData.roleIds.includes(role.id)}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                roleIds: checked
                                  ? [...prev.roleIds, role.id]
                                  : prev.roleIds.filter((id) => id !== role.id),
                              }))
                            }
                          />
                        </ItemActions>
                      </Item>
                      {index !== data.roles.length - 1 && <ItemSeparator />}
                    </React.Fragment>
                  ))}
                </ItemGroup>
              ) : (
                <p>Loading</p>
              )}
            </Field>

            <Field
              orientation="horizontal"
              className="justify-end flex-col sm:flex-row"
            >
              <Link
                href={"/admin/users"}
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
    </div>
  );
};

export default UpdateUserForm;
