import { CheckIcon, EyeClosedIcon, EyeIcon } from "lucide-react";
import type { Metadata } from "next";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tạo Người Dùng",
  robots: {
    index: false,
    follow: false,
  },
};

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
  {
    username: "evilrabbit1",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
  {
    username: "evilrabbit2",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
];

const CreateNewUserPage = () => {
  return (
    <>
      <header className="sticky top-0 right-0 z-50 bg-background/10 backdrop-blur-lg flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">Chức Năng Chính</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin/warehouses">
                Người dùng & Quyền
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo Người Dùng Mới</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      {/* <div className="flex flex-1 flex-col gap-4 p-4 mx-auto max-w-3xl">
        <h3 className="text-2xl font-bold">Tạo Người Dùng Mới</h3>
        <form>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username">Họ và tên</Label>
              <Input type="username" id="username" name="username" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username">Mật khẩu</Label>
              <Input type="username" id="username" name="username" />

              <div>
                <p>Mật khẩu phải bao gồm:</p>
                <ul className="list-inside list-disc text-sm">
                  <li>Check your card details</li>
                  <li>Ensure sufficient funds</li>
                  <li>Verify billing address</li>
                </ul>
              </div>
            </div>
            <div className="grid gap-3">
              <Label>Vai trò</Label>
              <p>
                làm tính năng thêm bao bì khi tạo kho. có thể chọn hoặc không
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
              <Link
                href="/admin/warehouses"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    className: "w-full sm:w-auto cursor-pointer",
                  })
                )}
              >
                Huỷ
              </Link>
              <Button
                variant={"default"}
                className="w-full sm:w-auto cursor-pointer"
              >
                Tạo
              </Button>
            </div>
          </div>
        </form>
      </div> */}

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
                    <Input id="email" placeholder="m@example.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="username">Họ và tên</FieldLabel>
                    <Input id="username" placeholder="Nguyễn Văn A" required />
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
            <FieldSet>
              <FieldLabel htmlFor="">Mật khẩu</FieldLabel>
              <FieldDescription>
                Chọn cách thức tạo mật khẩu cho tài khoản
              </FieldDescription>
              <RadioGroup defaultValue="auto">
                <FieldLabel htmlFor="generate">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Tạo tự động</FieldTitle>
                      <FieldDescription>
                        Mật khẩu được tạo ngẫu nhiên gửi đến người dùng.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="auto" id="generate" />
                  </Field>
                </FieldLabel>
                <FieldLabel
                  htmlFor="password"
                  className="has-[button[data-slot=radio-group-item]:is([data-state=checked])]:[&>[data-slot=field][data-orientation=vertical]]:block"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Tự điền</FieldTitle>
                      <FieldDescription>
                        Nhập mật khẩu cho tài khoản của người dùng.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="pwd" id="password" />
                  </Field>
                  <Field className="hidden">
                    <FieldContent>
                      <InputGroup>
                        <InputGroupInput
                          required
                          id="password"
                          name="password"
                          autoComplete="off"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            variant="ghost"
                            aria-label="Info"
                            size="icon-xs"
                          >
                            {true ? <EyeClosedIcon /> : <EyeIcon />}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      <div className="flex flex-col gap-y-1 text-sm font-normal text-muted-foreground">
                        <p className=" ">Mật khẩu của bạn phải bao gồm:</p>
                        <p
                          className={cn(
                            "inline-flex gap-x-2 items-center",
                            true ? "" : "text-green-400"
                          )}
                        >
                          <CheckIcon size={16} />
                          <span>8 đến 60 ký tự</span>
                        </p>
                        <p
                          className={cn(
                            "inline-flex gap-x-2 items-center",
                            false ? "" : "text-green-400"
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
            <FieldSet>
              <FieldLabel htmlFor="">Vai trò</FieldLabel>
              <FieldDescription>
                Chọn vai trò cho tài khoản người dùng
              </FieldDescription>

              <ScrollArea className="h-[315px] pr-2">
                <ItemGroup>
                  {people.map((person, index) => (
                    <React.Fragment key={person.username}>
                      <Item>
                        <ItemContent className="gap-1">
                          <ItemTitle>{person.username}</ItemTitle>
                          <ItemDescription>{person.email}</ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Switch />
                        </ItemActions>
                      </Item>
                      {index !== people.length - 1 && <ItemSeparator />}
                    </React.Fragment>
                  ))}
                </ItemGroup>
              </ScrollArea>
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
    </>
  );
};

export default CreateNewUserPage;
