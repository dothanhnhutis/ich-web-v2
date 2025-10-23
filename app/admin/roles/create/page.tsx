import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Checkbox } from "@/components/ui/checkbox";
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

const datas = [
  {
    name: "Người dùng",
    description: "Quản lý thông tin người dùng trong hệ thống.	",
    pers: [
      {
        label: "Create",
        key: "create:user",
      },
      {
        label: "Update",
        key: "update:user",
      },
      {
        label: "Read",
        key: "read:user",
      },
      {
        label: "Reset Password",
        key: "reset:user:password",
      },
    ],
  },
  {
    name: "Vai tro",
    description: "Quản lý thông tin người dùng trong hệ thống.	",
    pers: [
      {
        label: "Create",
        key: "create:role",
      },
      {
        label: "Update",
        key: "update:role",
      },
      {
        label: "Read",
        key: "read:role",
      },
      {
        label: "Delete",
        key: "delete:role",
      },
    ],
  },
];

const CreateRolePage = () => {
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
              <BreadcrumbPage className="text-muted-foreground">
                Người Dùng & Vai Trò
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden xs:block">
              <BreadcrumbLink href="/admin/roles">Vai Trò</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden xs:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo Vai Trò</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-4 w-full max-w-3xl mx-auto">
        <form>
          <FieldSet>
            <FieldLegend>Tạo vai trò mới</FieldLegend>
            <FieldDescription>
              Nhập tên và lựa chọn các quyền cho vai trò
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">
                  Tên vai trò
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Mô tả về vai trò</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea placeholder="Enter your message" />
                  <InputGroupAddon align="block-end">
                    <InputGroupText
                      id="description"
                      className="text-muted-foreground text-xs"
                    >
                      100/120
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              {/* 
              <Field>
                <FieldLabel>Quyền</FieldLabel>
                <FieldDescription>Chọn quyền cho vai trò.</FieldDescription>
                <table>
                  <thead>
                    <tr>
                      <th className="text-start">Tai Khoan</th>
                      <th className="text-center">Create</th>
                      <th>Update</th>
                      <th>Read</th>
                      <th>Reset Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Quản lý thông tin người dùng trong hệ thống.</td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table>
                  <thead>
                    <tr>
                      <th className="text-start">Tai Khoan</th>
                      <th>Create</th>
                      <th>Update</th>
                      <th>Read</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Quản lý thông tin người dùng trong hệ thống.</td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                      <td className="text-center">
                        <Checkbox />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Field> */}

              <Field>
                <FieldLabel>Quyền</FieldLabel>
                <FieldDescription>Chọn quyền cho vai trò.</FieldDescription>

                <Accordion type="multiple" className="w-full">
                  {datas.map((d) => (
                    <AccordionItem value={d.name} key={d.name}>
                      <AccordionTrigger>{d.name}</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        <table>
                          <tbody>
                            <tr>
                              <td className="text-start" rowSpan={2}>
                                {d.description}
                              </td>
                              {d.pers.map((l) => (
                                <td
                                  className="text-center px-2 pb-2"
                                  key={l.key}
                                >
                                  {l.label}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              {d.pers.map((l) => (
                                <td
                                  className="text-center px-2 pb-2"
                                  key={l.key}
                                >
                                  <Checkbox />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {/* <AccordionItem value="item-1">
                    <AccordionTrigger>Người dùng</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <table>
                        <tbody>
                          <tr>
                            <td className="text-start" rowSpan={2}>
                              Quản lý thông tin người dùng trong hệ thống.
                            </td>
                            <td className="text-center px-2 pb-2">Create</td>
                            <td className="text-center px-2 pb-2">Update</td>
                            <td className="text-center px-2 pb-2">Read</td>
                            <td className="text-center px-2 pb-2">
                              Reset Password
                            </td>
                          </tr>
                          <tr>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Vai tro</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <table>
                        <tbody>
                          <tr>
                            <td className="text-start" rowSpan={2}>
                              Quản lý thông tin người dùng trong hệ thống.
                            </td>
                            <td className="text-center px-2 pb-2">Create</td>
                            <td className="text-center px-2 pb-2">Update</td>
                            <td className="text-center px-2 pb-2">Read</td>
                            <td className="text-center px-2 pb-2">Delete</td>
                          </tr>
                          <tr>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                            <td className="text-center px-2 pb-2">
                              <Checkbox />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Return Policy</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>
                        We stand behind our products with a comprehensive 30-day
                        return policy. If you&apos;re not completely satisfied,
                        simply return the item in its original condition.
                      </p>
                      <p>
                        Our hassle-free return process includes free return
                        shipping and full refunds processed within 48 hours of
                        receiving the returned item.
                      </p>
                    </AccordionContent>
                  </AccordionItem> */}
                </Accordion>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </div>
    </>
  );
};

export default CreateRolePage;
