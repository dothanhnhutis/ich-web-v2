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
              <Field>
                <FieldLabel>Quyền</FieldLabel>
                <FieldDescription>
                  Chọn vai trò cho tài khoản người dùng
                </FieldDescription>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Người dùng</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>Quản lý thông tin người dùng trong hệ thống.</p>

                      <RadioGroup defaultValue="option-one">
                        <FieldGroup className="gap-3">
                          <Field orientation="horizontal">
                            <RadioGroupItem value="option-2" id="option-2" />
                            <FieldLabel
                              htmlFor="option-2"
                              className="font-normal"
                              defaultChecked
                            >
                              No Permision
                            </FieldLabel>
                          </Field>
                          <Field orientation="horizontal">
                            <RadioGroupItem
                              value="option-one"
                              id="option-one"
                            />
                            <FieldLabel
                              htmlFor="option-one"
                              className="font-normal"
                              defaultChecked
                            >
                              Read Only
                            </FieldLabel>
                          </Field>
                          <Field orientation="horizontal">
                            <RadioGroupItem
                              value="option-two"
                              id="option-two"
                            />
                            <FieldLabel
                              htmlFor="option-two"
                              className="font-normal"
                            >
                              Read & Update
                            </FieldLabel>
                          </Field>
                          <Field orientation="horizontal">
                            <RadioGroupItem
                              value="option-three"
                              id="option-three"
                            />
                            <FieldLabel
                              htmlFor="option-three"
                              className="font-normal"
                            >
                              Full Permission
                            </FieldLabel>
                          </Field>
                        </FieldGroup>
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Shipping Details</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>
                        We offer worldwide shipping through trusted courier
                        partners. Standard delivery takes 3-5 business days,
                        while express shipping ensures delivery within 1-2
                        business days.
                      </p>
                      <p>
                        All orders are carefully packaged and fully insured.
                        Track your shipment in real-time through our dedicated
                        tracking portal.
                      </p>
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
                  </AccordionItem>
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
