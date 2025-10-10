"use client";
import { CheckIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { queryRolesAction } from "@/data/role";
import { cn } from "@/lib/utils";

const roles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Có quyền cao nhất trong hệ thông",
  },
  {
    id: "2",
    name: "warehouse",
    description: "Toàn quyền kiểm soát kho hàng",
  },
];

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$/;

const CreateUserForm = () => {
  const [formData, setFormData] = React.useState<{
    email: string;
    username: string;
    roleIds: string[];
  }>({
    email: "",
    username: "",
    roleIds: [],
  });

  const [passwordData, setPasswordData] = React.useState({
    type: "auto",
    value: "",
    isHidden: true,
  });

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await queryRolesAction([["limit", "1"]]);
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Tạo Người Dùng Mới</FieldLegend>
            <FieldDescription>
              Điền thông tin bên dưới để tạo thành viên mới.
            </FieldDescription>
            <FieldGroup>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">Họ và tên</FieldLabel>
                  <Input
                    id="username"
                    placeholder="Nguyễn Văn A"
                    name="username"
                    required
                    value={formData.username}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }));
                    }}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLabel htmlFor="">Mật khẩu</FieldLabel>
            <FieldDescription>
              Chọn cách thức tạo mật khẩu cho tài khoản
            </FieldDescription>
            <RadioGroup
              value={passwordData.type}
              onValueChange={(v) =>
                setPasswordData({
                  value: "",
                  isHidden: true,
                  type: v,
                })
              }
            >
              <FieldLabel htmlFor="auto">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Tạo tự động</FieldTitle>
                    <FieldDescription>
                      Mật khẩu được tạo ngẫu nhiên gửi đến người dùng.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="auto" id="auto" />
                </Field>
              </FieldLabel>
              <FieldLabel
                htmlFor="custom"
                className="has-[button[data-slot=radio-group-item]:is([data-state=checked])]:[&>[data-slot=field][data-orientation=vertical]]:block"
              >
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>Tự điền</FieldTitle>
                    <FieldDescription>
                      Nhập mật khẩu cho tài khoản của người dùng.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="custom" id="custom" />
                </Field>
                <Field className="hidden py-2">
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        required={passwordData.type === "custom"}
                        id="password"
                        name="password"
                        autoComplete="off"
                        type={passwordData.isHidden ? "password" : "text"}
                        value={passwordData.value}
                        onChange={(e) => {
                          setPasswordData({
                            ...passwordData,
                            value: e.target.value,
                          });
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          variant="ghost"
                          size="icon-xs"
                          onClick={() =>
                            setPasswordData({
                              ...passwordData,
                              isHidden: !passwordData.isHidden,
                            })
                          }
                        >
                          {passwordData.isHidden ? (
                            <EyeClosedIcon />
                          ) : (
                            <EyeIcon />
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <div className="flex flex-col gap-y-1 text-sm font-normal text-muted-foreground">
                      <p>Mật khẩu của bạn phải bao gồm:</p>
                      <p
                        className={cn(
                          "inline-flex gap-x-2 items-center",
                          passwordData.value.length >= 8 &&
                            passwordData.value.length <= 60
                            ? "text-green-400"
                            : ""
                        )}
                      >
                        <CheckIcon size={16} />
                        <span>8 đến 60 ký tự</span>
                      </p>
                      <p
                        className={cn(
                          "inline-flex gap-x-2 items-center",
                          passwordRegex.test(passwordData.value)
                            ? "text-green-400"
                            : ""
                        )}
                      >
                        <CheckIcon size={16} />
                        <span>
                          Chữ Hoa, chữ thường, số và ký tự đặc biệt !@#$%^&_+
                        </span>
                      </p>
                    </div>
                  </FieldContent>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </FieldSet>

          <Field>
            <FieldLabel htmlFor="">Vai trò</FieldLabel>
            <FieldDescription>
              Chọn vai trò cho tài khoản người dùng. có thể chọn nhiều vai trò
            </FieldDescription>
            <ScrollArea className="max-h-[315px] pr-2">
              <ItemGroup>
                {roles.map((role, index) => (
                  <React.Fragment key={role.id}>
                    <Item>
                      <ItemContent className="gap-1">
                        <ItemTitle>{role.name}</ItemTitle>
                        <ItemDescription>{role.description}</ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <Switch
                          checked={formData.roleIds.includes(role.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                roleIds: [...prev.roleIds, role.id],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                roleIds: prev.roleIds.filter(
                                  (id) => id !== role.id
                                ),
                              }));
                            }
                          }}
                        />
                      </ItemActions>
                    </Item>
                    {index !== roles.length - 1 && <ItemSeparator />}
                  </React.Fragment>
                ))}
              </ItemGroup>
            </ScrollArea>
          </Field>

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

export default CreateUserForm;
