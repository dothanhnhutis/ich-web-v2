"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { queryRolesAction, type Role } from "@/data/role";
import type { UserDetail } from "@/data/user";
import { getShortName } from "@/lib/utils";

const UpdateUserForm = ({ user }: { user: UserDetail }) => {
  const [formData, setFormData] = React.useState<{
    email: string;
    username: string;
    status: boolean;
    roleIds: string[];
  }>({
    email: "",
    username: "",
    status: true,
    roleIds: [],
  });

  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    setFormData({
      email: user.email,
      username: user.username,
      roleIds: user.roles.flatMap((r) => r.permissions),
      status: user.status === "ACTIVE",
    });
  }, [user]);

  React.useEffect(() => {
    async function fetchRoles() {
      const {
        data: { roles },
      } = await queryRolesAction();

      setRoles(roles);

      console.log("roles", roles);
    }
    fetchRoles();
  }, []);

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Cập Nhật Tài Khoản</FieldLegend>
            <FieldDescription>
              Cập nhật thông tin cho tài khoản.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Thông tin tài khoản</FieldLabel>
                <div className="flex gap-4 flex-auto">
                  <Avatar className="bg-white w-10 h-10 xs:w-20 xs:h-20">
                    <AvatarImage
                      src={user.avatar?.url || "/images/logo-square.png"}
                      alt={user.username}
                    />
                    <AvatarFallback className="rounded-lg">
                      {getShortName(user.username)}
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
            </FieldGroup>
            <FieldGroup>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="username">Họ và tên</FieldLabel>
                  <Input id="username" placeholder="Nguyễn Văn A" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="status">Trạng thái</FieldLabel>
                  <div className="flex gap-2 items-center">
                    <p className="w-full text-sm text-muted-foreground">
                      Trạng thái của tài khoản.
                    </p>
                    <ToggleGroup variant="outline" type="single">
                      <ToggleGroupItem value="INACTIVE" aria-label="asc">
                        <p className="text-destructive">INACTIVE</p>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="ACTIVE" aria-label="desc">
                        <p className="text-green-500">ACTIVE</p>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLabel htmlFor="">Vai trò</FieldLabel>
            <FieldDescription>
              Chọn vai trò cho tài khoản người dùng <b>(có thể chọn nhiều)</b>
            </FieldDescription>

            <ItemGroup>
              {roles.map((role, index) => (
                <React.Fragment key={role.id}>
                  <Item className="px-0">
                    <ItemContent className="gap-1">
                      <ItemTitle>{role.name}</ItemTitle>
                      <ItemDescription>{role.description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Switch />
                    </ItemActions>
                  </Item>
                  {index !== roles.length - 1 && <ItemSeparator />}
                </React.Fragment>
              ))}
            </ItemGroup>
          </FieldSet>
          <Field orientation="horizontal" className="justify-end">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UpdateUserForm;
