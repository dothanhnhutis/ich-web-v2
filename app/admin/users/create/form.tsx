"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  EyeClosedIcon,
  EyeIcon,
  ShieldPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import z from "zod/v4";
import { Alert, AlertTitle } from "@/components/ui/alert";
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
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/components/user-context";
import { findManyRoleAction } from "@/data/role/findManyRoleAction";
import type { CreateUserFormData } from "@/data/user";
import { createUserAction } from "@/data/user/createUserAction";
import { cn } from "@/lib/utils";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]+$/;
const passwordSchema = z.string().min(8).max(125).regex(passwordRegex);

type PasswordData = {
  type: string;
  value: string;
  isHidden: boolean;
  focused: boolean;
  invalid: boolean;
};
const CreateUserForm = () => {
  const router = useRouter();
  const { hasPermission } = useUser();
  const [invalidEmail, setInvalidEmail] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<CreateUserFormData>({
    email: "",
    username: "",
    roleIds: [],
  });
  const [passwordData, setPasswordData] = React.useState<PasswordData>({
    type: "auto",
    value: "",
    isHidden: true,
    focused: false,
    invalid: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["roles", "created_at.desc"],
    queryFn: () => findManyRoleAction([["sort", "created_at.desc"]]),
    select(data) {
      return {
        ...data,
        roles: data.roles.filter(
          ({ can_delete, can_update }) => can_delete && can_update
        ),
      };
    },
    placeholderData: keepPreviousData,
  });

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

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res =
        passwordData.type === "auto"
          ? await createUserAction(formData)
          : await createUserAction({
              ...formData,
              password: passwordData.value,
            });

      if (!res.success) throw new Error(res.message);
      return res.message;
    },
    onSuccess: (message: string) => {
      toast.success(message);
      router.push("/admin/users");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSettled: () => {
      handleRestData();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    mutate();
  };

  if (isLoading)
    return (
      <FieldGroup>
        <FieldSet>
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-60 h-3" />
          </div>

          <FieldGroup>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field>
                <div>
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-full h-9" />
              </Field>
              <Field>
                <div>
                  <Skeleton className="w-20 h-3" />
                </div>
                <Skeleton className="w-full h-9" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <div className="space-y-2">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-60 h-3" />
          </div>
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </FieldSet>

        <Field>
          <div className="space-y-2">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-80 h-3" />
          </div>
          <div className="flex flex-col gap-2 px-4">
            <div className="flex items-center py-4">
              <div className="space-y-2 w-full">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-50 h-2" />
              </div>
              <Skeleton className="w-[32px] h-[18px] shrink-0" />
            </div>
            <div className="flex items-center py-4">
              <div className="space-y-2 w-full">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-50 h-2" />
              </div>
              <Skeleton className="w-[32px] h-[18px] shrink-0" />
            </div>
            <div className="flex items-center py-4">
              <div className="space-y-2 w-full">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-50 h-2" />
              </div>
              <Skeleton className="w-[32px] h-[18px] shrink-0" />
            </div>
            <div className="flex items-center py-4">
              <div className="space-y-2 w-full">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-50 h-2" />
              </div>
              <Skeleton className="w-[32px] h-[18px] shrink-0" />
            </div>
          </div>
        </Field>
        <Field orientation="horizontal" className="justify-end">
          <Skeleton className="w-[60px] h-9" />
          <Skeleton className="w-[55px] h-9" />
        </Field>
      </FieldGroup>
    );

  return (
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

          {data ? (
            data.roles.length === 0 ? (
              hasPermission("create:role") ? (
                <Item variant="outline" size="sm" asChild>
                  <Link href="/admin/roles/create">
                    <ItemMedia>
                      <ShieldPlusIcon className="size-5" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        Không có vai trò nào trong hệ thống.
                      </ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      Tạo
                      <ChevronRightIcon className="size-4" />
                    </ItemActions>
                  </Link>
                </Item>
              ) : (
                <Alert>
                  <CircleAlertIcon />
                  <AlertTitle>
                    Không tìm thấy vai trò nào trong hệ thống.
                  </AlertTitle>
                </Alert>
              )
            ) : (
              <ScrollArea className="max-h-[315px] pr-2">
                <ItemGroup>
                  {data.roles.map((role, index) => (
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
                      {index !== data.roles.length - 1 && <ItemSeparator />}
                    </React.Fragment>
                  ))}
                </ItemGroup>
              </ScrollArea>
            )
          ) : null}
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
  );
};

export default CreateUserForm;
