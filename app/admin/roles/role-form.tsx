"use client";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { PlusIcon, SearchIcon, Trash2Icon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import Pagination from "@/components/page1";
import PermissionComponent from "@/components/permission";
import SortModal from "@/components/sort-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sortUserData } from "@/constants";
import {
  createRoleAction,
  type RoleDetail,
  updateRoleByIdAction,
} from "@/data/role";
import { queryUsersAction, type UserWithoutPassword } from "@/data/user";
import { cn, convertImage, getShortName } from "@/lib/utils";

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

type UserModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  users?: Omit<UserWithoutPassword, "role_count">[];
  handleSave?: (users: Omit<UserWithoutPassword, "role_count">[]) => void;
};

const UserModal = ({ handleSave, users, ...props }: UserModalProps) => {
  const [selectedUsers, setSelectedUsers] = React.useState<
    Omit<UserWithoutPassword, "role_count">[]
  >([]);

  const [searchType, setSearchType] = React.useState<string>("email");
  const [searchData, setSearchData] = React.useState<string>("");
  const [userSearchParams, setUserSearchParams] =
    React.useState<string>("page=1&limit=10");

  const { data, isPending } = useQuery({
    queryKey: ["users", userSearchParams],
    queryFn: () => queryUsersAction(userSearchParams),
    staleTime: 10_000,
    placeholderData: keepPreviousData,
  });

  React.useEffect(() => {
    if (users) setSelectedUsers(users);
  }, [users]);

  return (
    <AlertDialog {...props}>
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
                searchTypes.find((s) => s.value === searchType)?.placeholder ??
                ""
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
                  const newSearchParams = new URLSearchParams(userSearchParams);
                  newSearchParams.delete(
                    value === "email" ? "username" : "email"
                  );
                  setUserSearchParams(newSearchParams.toString());
                  setSearchType(value);
                  setSearchData("");
                }}
              >
                <SelectTrigger className="font-mono rounded-tr-none rounded-br-none  border-l-0 border-y-0 shadow-none">
                  {searchTypes.find((s) => s.value === searchType)?.label ?? ""}
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
                  const newSearchParams = new URLSearchParams(userSearchParams);
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
          <SortModal
            data={sortUserData}
            searchParamsString={userSearchParams}
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
                        data
                          ? data.users.every((u) =>
                              selectedUsers.map(({ id }) => id).includes(u.id)
                            )
                            ? true
                            : data.users.every(
                                (u) =>
                                  !selectedUsers
                                    .map(({ id }) => id)
                                    .includes(u.id)
                              )
                            ? false
                            : "indeterminate"
                          : false
                      }
                      onCheckedChange={(checked) => {
                        let newUsers: Omit<
                          UserWithoutPassword,
                          "role_count"
                        >[] = [];
                        if (!data) return;
                        if (checked === "indeterminate" || !checked) {
                          newUsers = selectedUsers.filter(
                            ({ id }) =>
                              !data.users.map(({ id }) => id).includes(id)
                          );
                        } else {
                          newUsers = [
                            ...selectedUsers,
                            ...data.users.filter(
                              ({ id }) =>
                                !selectedUsers.map(({ id }) => id).includes(id)
                            ),
                          ];
                        }
                        setSelectedUsers(newUsers);
                      }}
                    />
                  </TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead className="text-center">Vai trò</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data || data.users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-12">
                      Không có kết quả.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedUsers
                            .map(({ id }) => id)
                            .includes(u.id)}
                          onCheckedChange={(checked) => {
                            const newUserIds: Omit<
                              UserWithoutPassword,
                              "role_count"
                            >[] = checked
                              ? [...selectedUsers, u]
                              : selectedUsers.filter(({ id }) => id !== u.id);
                            setSelectedUsers(newUserIds);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Avatar className="bg-white size-12">
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {data && (
          <Pagination
            metadata={data.metadata}
            searchParamsString={userSearchParams}
            onPageChange={(v) => setUserSearchParams(v)}
          />
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setSelectedUsers(users ?? []);
            }}
          >
            Huỷ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (handleSave) {
                handleSave(selectedUsers);
              }
            }}
          >
            Lưu
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DESCRIPTION_LENGTH = 225;

type RoleFormProps = {
  role?: RoleDetail;
};

type FormData = {
  name: string;
  description: string;
  permissions: string[];
  users: Omit<UserWithoutPassword, "role_count">[];
  status: string;
};

const RoleForm = ({ role }: RoleFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: role?.name ?? "",
    description: role?.description ?? "",
    permissions: role?.permissions ?? [],
    status: role?.status ?? "ACTIVE",
    users: role?.users ?? [],
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async () => {
      const userIds = formData.users.map(({ id }) => id);
      const res = await (role
        ? updateRoleByIdAction(role.id, { ...formData, userIds })
        : createRoleAction({
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
            userIds,
          }));

      if (!res.success) throw new Error(res.message);
      return res.message;
    },
    onSuccess: (message: string) => {
      router.push("/admin/roles");
      toast.success(message);
    },
    onError: (message: string) => {
      if (role)
        setFormData({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          status: role.status,
          users: role.users,
        });
      else
        setFormData({
          name: "",
          description: "",
          permissions: [],
          status: "ACTIVE",
          users: [],
        });

      toast.error(message);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldLegend>Cập nhật vai trò</FieldLegend>
          <FieldDescription>
            Nhập tên và lựa chọn các quyền cho vai trò
          </FieldDescription>
          <FieldGroup>
            <div
              className={cn(
                "grid items-center gap-4 flex-1",
                role ? "sm:grid-cols-[7fr_3fr]" : ""
              )}
            >
              <Field>
                <FieldLabel htmlFor="name">Tên vai trò</FieldLabel>
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
      </form>
      <UserModal
        open={isOpen}
        onOpenChange={setIsOpen}
        users={formData.users}
        handleSave={(users) => {
          setFormData((prev) => ({ ...prev, users }));
        }}
      />
    </div>
  );
};

export default RoleForm;
