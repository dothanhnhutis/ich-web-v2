"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import PageComponent from "@/components/page";
import PermissionComponent from "@/components/permission";
import SortComponent, { SortComponentV2 } from "@/components/sort";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sortUserData } from "@/constants";
import { type CreateRoleData, createRoleAction } from "@/data/role";
import { queryUserAction, type User } from "@/data/user";
import { cn, getShortName } from "@/lib/utils";

const DESCRIPTION_LENGTH = 225;

const searchTypes = [
  {
    value: "email",
    label: "Email",
    placeholder: "Nhập Email",
  },
  {
    value: "username",
    label: "Tên khách hàng",
    placeholder: "Nhập tên khách hàng",
  },
];

const CreateRoleForm = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState<CreateRoleData>({
    name: "",
    description: "",
    permissions: [],
    userIds: ["0199f19b-18a1-74d4-bab1-37fcff986b59"],
  });
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isPending, startTransition] = React.useTransition();
  const [searchType, setSearchType] = React.useState("email");
  const [searchData, setSearchData] = React.useState<string>("");
  const [userSearchParams, setUserSearchParams] =
    React.useState("page=1&limit=10");

  const [{ users, metadata }, setUserData] = React.useState<{
    metadata: Metadata;
    users: User[];
  }>({
    metadata: {
      hasNextPage: false,
      itemEnd: 0,
      itemStart: 0,
      limit: 0,
      totalItem: 0,
      totalPage: 0,
    },
    users: [],
  });

  React.useEffect(() => {
    async function fetchUser() {
      const { data } = await queryUserAction(userSearchParams);
      setUserData(data);
    }
    fetchUser();
  }, [userSearchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createRoleAction(formData);
      if (res.statusCode === 200) {
        router.push("/admin/roles");
        toast.success(res.data.message);
      } else {
        setFormData({
          name: "",
          description: "",
          permissions: [],
          userIds: [],
        });
        toast.error(res.data.message);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Tạo vai trò mới</FieldLegend>
          <FieldDescription>
            Nhập tên và lựa chọn các quyền cho vai trò
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Tên vai trò</FieldLabel>

              <InputGroup>
                <InputGroupInput
                  disabled={isPending}
                  placeholder="Nhập tên vai trò"
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
            <Field>
              <FieldLabel htmlFor="description">Mô tả</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  disabled={isPending}
                  id="description"
                  placeholder="Nhập mô tả cho vai trò"
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
                  {formData.userIds.length === 0 ? (
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
                        {Array.from({ length: 10 }, (_, idx) => idx + 1).map(
                          (id) => (
                            <div
                              key={id}
                              className="group flex items-center gap-2 shadow dark:border py-1 px-2 rounded-lg hover:bg-muted"
                            >
                              <Avatar className="size-9 group-hover:hidden">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>LR</AvatarFallback>
                              </Avatar>
                              <Button
                                type="button"
                                size={"icon"}
                                variant={"ghost"}
                                className="hidden group-hover:flex text-center rounded-full bg-muted-foreground hover:bg-background dark:hover:bg-background text-muted"
                              >
                                <Trash2Icon />
                              </Button>

                              <div className="w-full">
                                <p className="font-semibold text-base">
                                  Thanh Nhut
                                </p>
                                <p className="text-sm">gaconght@gmail.com</p>
                              </div>
                            </div>
                          )
                        )}
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
                Tạo
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tài khoản</AlertDialogTitle>
            <AlertDialogDescription>
              Chọn tài khoản muốn thêm vai trò nay
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-between items-center gap-2">
            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder={
                  searchTypes.find((s) => s.value === searchType)
                    ?.placeholder ?? ""
                }
                value={searchData}
                onChange={(e) => {
                  setSearchData(e.target.value);
                }}
              />
              <InputGroupAddon className="pl-1.5">
                <Select
                  value={searchType}
                  onValueChange={(value) => {
                    const newSearchParams = new URLSearchParams(
                      userSearchParams
                    );
                    newSearchParams.delete(
                      value === "email" ? "username" : "email"
                    );
                    setUserSearchParams(newSearchParams.toString());
                    setSearchType(value);
                    setSearchData("");
                  }}
                >
                  <SelectTrigger className="font-mono rounded-tr-none rounded-br-none  border-l-0 border-y-0 shadow-none">
                    {searchTypes.find((s) => s.value === searchType)?.label ??
                      ""}
                  </SelectTrigger>
                  <SelectContent className="min-w-24">
                    {searchTypes.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <span className="text-muted-foreground">
                          {currency.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                className={cn(
                  "p-0",
                  searchData.length === 0 ? "hidden" : "block"
                )}
              >
                <button
                  type="button"
                  className="p-2"
                  onClick={() => {
                    setSearchData("");
                    const newSearchParams = new URLSearchParams(
                      userSearchParams
                    );
                    newSearchParams.delete(searchType);
                    setUserSearchParams(newSearchParams.toString());
                  }}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end" className="pr-2">
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  onClick={() => {
                    if (searchData !== "") {
                      const newSearchParams = new URLSearchParams(
                        userSearchParams
                      );
                      newSearchParams.set(searchType, searchData);
                      setUserSearchParams(newSearchParams.toString());
                    }
                  }}
                >
                  <SearchIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>

            {/* <SortComponent
              data={{
                email: { description: "Sắp xếp thep email", title: "email" },
              }}
            /> */}

            <SortComponentV2
              data={sortUserData}
              sort={userSearchParams}
              onSortChange={setUserSearchParams}
            />
          </div>
          <div className="overflow-hidden rounded-lg border">
            <div className="relative w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">
                      <Checkbox
                        checked={
                          users.every((u) => formData.userIds.includes(u.id))
                            ? true
                            : users.every(
                                (u) => !formData.userIds.includes(u.id)
                              )
                            ? false
                            : "indeterminate"
                        }
                        onCheckedChange={(checked) => {
                          const ids = users.map(({ id }) => id);
                          const userIds =
                            checked === "indeterminate" || !checked
                              ? Array.from(
                                  new Set(
                                    formData.userIds.filter(
                                      (k) => !ids.includes(k)
                                    )
                                  )
                                )
                              : Array.from(
                                  new Set([...formData.userIds, ...ids])
                                );
                          setFormData((prev) => ({ ...prev, userIds }));
                        }}
                      />
                    </TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead className="text-center">Vai trò</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={formData.userIds.includes(u.id)}
                          onCheckedChange={(checked) => {
                            const userIds = checked
                              ? [...formData.userIds, u.id]
                              : formData.userIds.filter((id) => id !== u.id);
                            setFormData((prev) => ({ ...prev, userIds }));
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Avatar className="bg-white size-12">
                            <AvatarImage
                              src={u.avatar?.url || "/images/logo-square.png"}
                              alt={u.avatar?.fileName || u.username}
                            />
                            <AvatarFallback>
                              {getShortName(u.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {u.username}
                            </p>
                            <p className="text-sm"> {u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {u.role_count}
                      </TableCell>
                    </TableRow>
                  ))}

                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-12">
                        Không có kết quả.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex items-center text-sm @container">
            <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
              <p className="@2xl:hidden">{`Trang ${
                metadata.itemEnd > 0
                  ? Math.ceil(metadata.itemEnd / metadata.limit)
                  : 0
              } / ${metadata.totalPage}`}</p>

              <div className="flex items-center gap-2 @2xl:hidden">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={metadata.itemStart <= 1}
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(
                      userSearchParams.toString()
                    );
                    newSearchParams.set("page", "1");
                    setUserSearchParams(newSearchParams.toString());
                  }}
                >
                  <ChevronsLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={metadata.itemStart <= 1}
                  onClick={() => {
                    const currentPage =
                      Math.ceil(metadata.itemEnd / metadata.limit) - 1;
                    const newSearchParams = new URLSearchParams(
                      userSearchParams.toString()
                    );
                    newSearchParams.set("page", currentPage.toString());
                    setUserSearchParams(newSearchParams.toString());
                  }}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={
                    metadata.totalPage === 0 ||
                    metadata.totalPage.toString() ===
                      new URLSearchParams(userSearchParams).get("page")
                  }
                  onClick={() => {
                    const currentPage =
                      Math.ceil(metadata.itemEnd / metadata.limit) + 1;
                    const newSearchParams = new URLSearchParams(
                      userSearchParams.toString()
                    );
                    newSearchParams.set("page", currentPage.toString());
                    setUserSearchParams(newSearchParams.toString());
                  }}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={
                    metadata.totalPage === 0 ||
                    metadata.totalPage.toString() ===
                      new URLSearchParams(userSearchParams).get("page")
                  }
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(
                      userSearchParams.toString()
                    );
                    newSearchParams.set("page", metadata.totalPage.toString());
                    setUserSearchParams(newSearchParams.toString());
                  }}
                >
                  <ChevronsRightIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction>Thêm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateRoleForm;
