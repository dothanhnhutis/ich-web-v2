import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const LoadingPage = () => {
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
              <BreadcrumbPage className="text-muted-foreground">
                Người Dùng & Vai Trò
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Vai Trò</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-4 w-full max-w-3xl mx-auto">
        <FieldSet>
          <FieldLegend>Cập nhật vai trò</FieldLegend>
          <FieldDescription>
            Nhập tên và lựa chọn các quyền cho vai trò
          </FieldDescription>
          <FieldGroup>
            <div
              className={cn(
                "grid items-center gap-4",
                role ? "sm:grid-cols-[7fr_3fr]" : ""
              )}
            >
              <Field>
                <FieldLabel
                  htmlFor="name"
                  className="block after:ml-0.5 after:text-red-500 after:content-['*']"
                >
                  Tên vai trò
                </FieldLabel>
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
                          e.target.value.length <= 100
                            ? e.target.value
                            : prev.name,
                      }))
                    }
                  />
                  <InputGroupAddon align="inline-end">{`${formData.name.length} / 100`}</InputGroupAddon>
                </InputGroup>
              </Field>
              {role && (
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
              )}
            </div>

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
              <Tabs defaultValue="access">
                <TabsList className="bg-transparent ">
                  <TabsTrigger
                    value="access"
                    asChild
                    className="border-2 border-x-0 border-t-0 data-[state=active]:text-primary data-[state=active]:rounded-none  data-[state=active]:border-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-foreground"
                  >
                    <FieldLabel>Quyền truy cập</FieldLabel>
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    asChild
                    className="border-2 border-x-0 border-t-0 data-[state=active]:text-primary data-[state=active]:rounded-none  data-[state=active]:border-primary data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-foreground"
                  >
                    <FieldLabel>Tài khoản</FieldLabel>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="access">
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
                </TabsContent>
                <TabsContent value="users">
                  {formData.users.length === 0 ? (
                    <Empty className="mt-4 border border-dashed">
                      <EmptyHeader>
                        <EmptyMedia>
                          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2">
                            <Avatar>
                              <AvatarImage
                                src="/avatars/user-3.jpg"
                                alt="@shadcn"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarImage
                                src="/avatars/user-8.jpg"
                                alt="@maxleiter"
                              />
                              <AvatarFallback>LR</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarImage
                                src="/avatars/user-9.jpg"
                                alt="@evilrabbit"
                              />
                              <AvatarFallback>ER</AvatarFallback>
                            </Avatar>
                          </div>
                        </EmptyMedia>
                        <EmptyTitle>Không có tài khoản</EmptyTitle>
                        <EmptyDescription>
                          Thêm tài khoản muốn thêm vai trò này
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setIsOpen(true)}
                        >
                          <PlusIcon />
                          Thêm tài khoản
                        </Button>
                      </EmptyContent>
                    </Empty>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <FieldDescription>
                          Chọn tài khoản muốn cấp quyền truy cập này.
                        </FieldDescription>
                        <Button
                          type={"button"}
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => setIsOpen(true)}
                        >
                          <PlusIcon />
                          <span className="hidden sm:inline">
                            Thêm tài khoản
                          </span>
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4 border p-2 rounded-md overflow-y-scroll max-h-[300px]">
                        {formData.users.map((u) => (
                          <div
                            key={u.id}
                            className="group flex items-center gap-2 shadow dark:border py-1 px-2 rounded-lg hover:bg-muted"
                          >
                            <Avatar className="size-9 group-hover:hidden bg-white">
                              <AvatarImage
                                src={
                                  u.avatar
                                    ? convertImage(u.avatar).url
                                    : "/images/logo-square.png"
                                }
                                alt={u.avatar?.file_name || u.username}
                              />
                              <AvatarFallback>
                                {getShortName(u.username)}
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              size={"icon"}
                              variant={"ghost"}
                              className="hidden group-hover:flex text-center rounded-full bg-muted-foreground hover:bg-background dark:hover:bg-background text-muted"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  users: prev.users.filter(
                                    ({ id }) => id !== u.id
                                  ),
                                }));
                              }}
                            >
                              <Trash2Icon />
                            </Button>

                            <div className="w-full">
                              <p className="font-semibold text-base">
                                {u.username}
                              </p>
                              <p className="text-sm">{u.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
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
                {role ? "Cập nhật" : "Tạo"}
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </>
  );
};

export default LoadingPage;
