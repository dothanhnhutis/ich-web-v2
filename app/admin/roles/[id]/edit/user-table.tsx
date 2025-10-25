"use client";
import React from "react";
import PageComponent from "@/components/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserByRoleIdAction } from "@/data/role";
import type { UserWithoutPassword } from "@/data/user";
import { getShortName } from "@/lib/utils";

type Props = {
  roleId: string;
};

const UserTable = ({ roleId }: Props) => {
  const [users, setUsers] = React.useState([]);
  const [checkList, setcheckList] = React.useState<{
    users: Omit<UserWithoutPassword, "role_count">[];
    metadata: Metadata;
  }>({
    users: [],
    metadata: {
      totalItem: 0,
      totalPage: 0,
      hasNextPage: false,
      limit: 0,
      itemStart: 0,
      itemEnd: 0,
    },
  });

  React.useEffect(() => {
    async function fetchData() {
      const data = await getUserByRoleIdAction(roleId);
      setcheckList(data);
    }
    fetchData();
  }, [roleId]);

  return (
    <div className="outline-none relative flex flex-col gap-4 overflow-auto">
      <div className="overflow-hidden rounded-lg border">
        <div className="relative w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">
                  <Checkbox />
                </TableHead>
                <TableHead className="w-full">Tài khoản</TableHead>
                <TableHead className="text-center">Vai trò</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkList.users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Avatar className="bg-white">
                        <AvatarImage
                          src={u.avatar?.url || "/images/logo-square.png"}
                          alt={u.avatar?.fileName || u.username}
                        />
                        <AvatarFallback>
                          {getShortName(u.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-lg">Do Thanh Nhut</p>
                        <p className="text-sm">gaconght@gmail.com</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">1</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} className="text-center h-12">
                  Không có kết quả.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      {/* <PageComponent metadata={checkList.metadata} /> */}
    </div>
  );
};

export default UserTable;
