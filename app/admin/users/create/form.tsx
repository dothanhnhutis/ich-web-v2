"use client";
import { CheckIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import z from "zod/v4";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { queryRolesAction, type Role } from "@/data/role";
import { type CreateUserAPIRes, createUserAction } from "@/data/user";
import { cn } from "@/lib/utils";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$/;
const passwordSchema = z.string().min(8).max(125).regex(passwordRegex);

const CreateUserForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [invalidEmail, setInvalidEmail] = React.useState<boolean>(false);

  const [formData, setFormData] = React.useState<{
    email: string;
    username: string;
    roleIds: string[];
  }>({
    email: "",
    username: "",
    roleIds: [],
  });
  const [roles, setRoles] = React.useState<Role[]>([]);

  const [passwordData, setPasswordData] = React.useState({
    type: "auto",
    value: "",
    isHidden: true,
    focused: false,
    invalid: true,
  });

  React.useEffect(() => {
    async function fetchData() {
      const data = await queryRolesAction([["sort", "created_at.desc"]]);
      setRoles(data.roles);
    }
    fetchData();
  }, []);

  const handleRestData = () => {
    setFormData({
      email: "",
      username: "",
      roleIds: [],
    });
    setPasswordData({
      type: "auto",
      value: "",
      isHidden: true,
      focused: false,
      invalid: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let res: CreateUserAPIRes;
    if (!z.email().safeParse(formData.email).success) {
      toast.warning("Email không hợp lệ.");
      setFormData({ ...formData, email: "" });
      setInvalidEmail(true);
      return;
    }

    if (
      passwordData.type === "custom" &&
      !passwordSchema.safeParse(passwordData.value).success
    ) {
      toast.warning("Mật khẩu không hợp lệ.");
      setPasswordData((prev) => ({
        ...prev,
        value: "",
      }));
      return;
    }

    startTransition(async () => {
      if (passwordData.type === "auto") {
        res = await createUserAction(formData);
      } else {
        res = await createUserAction({
          ...formData,
          password: passwordData.value,
        });
      }

      if (res.statusCode === 200) {
        router.push("/admin/users");
        toast.success(res.data.message);
      } else {
        handleRestData();
        toast.error(res.data.message);
      }
    });
  };

  return (
    <div className="p-4 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Tạo Người Dùng Mới</FieldLegend>
            <FieldDescription>
              Điền thông tin bên dưới để tạo thành viên mới.
            </FieldDescription>
            <FieldGroup>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="block after:ml-0.5 after:text-red-500 after:content-['*']"
                  >
                    Email
                  </FieldLabel>

                  <Input
                    data-invalid={invalidEmail}
                    disabled={isPending}
                    id="email"
                    placeholder="m@example.com"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    className="data-[invalid=true]:border-destructive focus-visible:data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/50 focus-visible:data-[invalid=true]:ring-destructive/50"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      if (invalidEmail) {
                        setInvalidEmail(false);
                      }
                    }}
                  />
                </Field>
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
                    name="username"
                    required
                    disabled={isPending}
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
            <FieldLabel
              htmlFor=""
              className="block after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Mật khẩu
            </FieldLabel>
            <FieldDescription>
              Chọn cách thức tạo mật khẩu cho tài khoản
            </FieldDescription>
            <RadioGroup
              disabled={isPending}
              value={passwordData.type}
              onValueChange={(v) =>
                setPasswordData({
                  value: "",
                  isHidden: true,
                  type: v,
                  focused: false,
                  invalid: true,
                })
              }
            >
              <FieldLabel htmlFor="auto">
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>
                      Tạo tự động
                      <span>
                        <b>(Khuyến khích)</b>
                      </span>
                    </FieldTitle>
                    <FieldDescription>
                      Mật khẩu được tạo ngẫu nhiên gửi đến người dùng.
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="auto" id="auto" />
                </Field>
              </FieldLabel>
              <FieldLabel
                htmlFor="custom"
                className={cn(
                  "has-[input[data-slot=input-group-control][data-invalid=false][data-focused=true]]:has-[button[data-slot=radio-group-item]:is([data-state=checked])]:bg-destructive/5 ",
                  "has-[input[data-slot=input-group-control][data-invalid=false][data-focused=true]]:has-[button[data-slot=radio-group-item]:is([data-state=checked])]:border-destructive",
                  "has-[input[data-slot=input-group-control][data-invalid=false][data-focused=true]]:has-[button[data-slot=radio-group-item]:is([data-state=checked])]:[&_div[data-slot=input-group][role=group]]:border-destructive",
                  "focus-within:has-[input[data-slot=input-group-control][data-invalid=false][data-focused=true]]:has-[button[data-slot=radio-group-item]:is([data-state=checked])]:[&_div[data-slot=input-group][role=group]]:ring-destructive/50",
                  "has-[button[data-slot=radio-group-item]:is([data-state=checked])]:[&>[data-slot=field][data-orientation=vertical]]:block"
                )}
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
                    <InputGroup className="bg-background dark:bg-background shadow-0">
                      <InputGroupInput
                        data-invalid={passwordData.invalid}
                        data-focused={passwordData.focused}
                        disabled={isPending}
                        required={passwordData.type === "custom"}
                        className="font-normal"
                        id="password"
                        name="password"
                        autoComplete="off"
                        placeholder="Nhập mật khẩu...."
                        type={passwordData.isHidden ? "password" : "text"}
                        value={passwordData.value}
                        onChange={(e) => {
                          setPasswordData({
                            ...passwordData,
                            value: e.target.value,
                            invalid: passwordSchema.safeParse(e.target.value)
                              .success,
                          });
                        }}
                        onBlur={() => {
                          setPasswordData({
                            ...passwordData,
                            focused: true,
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
                          disabled={isPending}
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
            <Link
              href={"/admin/users"}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Huỷ
            </Link>

            <Button disabled={isPending} type="submit">
              {isPending && <Spinner />}
              Tạo
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default CreateUserForm;
