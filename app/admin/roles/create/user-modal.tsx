"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import React from "react";
import { SortComponentV2 } from "@/components/sort";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sortUserData } from "@/constants";
import { queryUserAction, type UserWithoutPassword } from "@/data/user";
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

type Props = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  users?: UserWithoutPassword[];
  handleSave?: (users: UserWithoutPassword[]) => void;
};

const UserModal = ({ handleSave, users, ...props }: Props) => {
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserWithoutPassword[]
  >([]);

  const [searchType, setSearchType] = React.useState<string>("email");
  const [searchData, setSearchData] = React.useState<string>("");
  const [userSearchParams, setUserSearchParams] =
    React.useState("page=1&limit=10");
  const [userData, setUserData] = React.useState<
    Awaited<ReturnType<typeof queryUserAction>>
  >({
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
      const data = await queryUserAction(userSearchParams);
      setUserData(data);
    }
    fetchUser();
  }, [userSearchParams]);

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
                        userData.users.every((u) =>
                          selectedUsers.map(({ id }) => id).includes(u.id)
                        )
                          ? true
                          : userData.users.every(
                              (u) =>
                                !selectedUsers
                                  .map(({ id }) => id)
                                  .includes(u.id)
                            )
                          ? false
                          : "indeterminate"
                      }
                      onCheckedChange={(checked) => {
                        let newUsers: UserWithoutPassword[] = [];
                        if (checked === "indeterminate" || !checked) {
                          newUsers = selectedUsers.filter(
                            ({ id }) =>
                              !userData.users.map(({ id }) => id).includes(id)
                          );
                          console.log(newUsers);
                        } else {
                          console.log("2");
                          newUsers = [
                            ...selectedUsers,
                            ...userData.users.filter(
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
                {userData.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedUsers
                          .map(({ id }) => id)
                          .includes(u.id)}
                        onCheckedChange={(checked) => {
                          const newUserIds: UserWithoutPassword[] = checked
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
                          <p className="font-semibold text-lg">{u.username}</p>
                          <p className="text-sm"> {u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {u.role_count}
                    </TableCell>
                  </TableRow>
                ))}

                {userData.users.length === 0 && (
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
              userData.metadata.itemEnd > 0
                ? Math.ceil(userData.metadata.itemEnd / userData.metadata.limit)
                : 0
            } / ${userData.metadata.totalPage}`}</p>

            <div className="flex items-center gap-2 @2xl:hidden">
              <Button
                variant={"outline"}
                size={"icon"}
                disabled={userData.metadata.itemStart <= 1}
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
                disabled={userData.metadata.itemStart <= 1}
                onClick={() => {
                  const currentPage =
                    Math.ceil(
                      userData.metadata.itemEnd / userData.metadata.limit
                    ) - 1;
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
                  userData.metadata.totalPage === 0 ||
                  userData.metadata.totalPage.toString() ===
                    new URLSearchParams(userSearchParams).get("page")
                }
                onClick={() => {
                  const currentPage =
                    Math.ceil(
                      userData.metadata.itemEnd / userData.metadata.limit
                    ) + 1;
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
                  userData.metadata.totalPage === 0 ||
                  userData.metadata.totalPage.toString() ===
                    new URLSearchParams(userSearchParams).get("page")
                }
                onClick={() => {
                  const newSearchParams = new URLSearchParams(
                    userSearchParams.toString()
                  );
                  newSearchParams.set(
                    "page",
                    userData.metadata.totalPage.toString()
                  );
                  setUserSearchParams(newSearchParams.toString());
                }}
              >
                <ChevronsRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

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

export default UserModal;
