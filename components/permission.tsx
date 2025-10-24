"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";

const permissionData = [
  {
    name: "Bảng điều khiển",
    description: "Xem các báo cáo thống kê",
    pers: [
      {
        label: "Đọc",
        key: "read:dashboard",
      },
    ],
  },
  {
    name: "Người dùng",
    description: "Quản lý thông tin tài khoản trong hệ thống.",
    pers: [
      {
        label: "Tạo",
        key: "create:user",
      },
      {
        label: "Cập nhật",
        key: "update:user",
      },
      {
        label: "Đọc",
        key: "read:user",
      },
      {
        label: "Khôi phục mật khẩu",
        key: "reset:user:password",
      },
    ],
  },
  {
    name: "Vai trò",
    description: "Quản lý vai trò của hệ thống",
    pers: [
      {
        label: "Tạo",
        key: "create:role",
      },
      {
        label: "Cập nhật",
        key: "update:role",
      },
      {
        label: "Đọc",
        key: "read:role",
      },
      {
        label: "Xoá",
        key: "delete:role",
      },
    ],
  },
  {
    name: "Nhà kho",
    description: "Quản lý kho hàng của nhà máy",
    pers: [
      {
        label: "Tạo",
        key: "create:warehouse",
      },
      {
        label: "Cập nhật",
        key: "update:warehouse",
      },
      {
        label: "Đọc",
        key: "read:warehouse",
      },
      {
        label: "Xoá",
        key: "delete:warehouse",
      },
    ],
  },
  {
    name: "Bao bì",
    description: "Quản lý bao bì trong kho hàng",
    pers: [
      {
        label: "Tạo",
        key: "create:packaging",
      },
      {
        label: "Cập nhật",
        key: "update:packaging",
      },
      {
        label: "Đọc",
        key: "read:packaging",
      },
      {
        label: "Xoá",
        key: "delete:packaging",
      },
    ],
  },
  {
    name: "Nhập xuất kho",
    description: "Quản lý nhập xuất hàng hoá trong kho hàng",
    pers: [
      {
        label: "Tạo",
        key: "create:transaction",
      },
      {
        label: "Cập nhật",
        key: "update:transaction",
      },
      {
        label: "Đọc",
        key: "read:transaction",
      },
      {
        label: "Xoá",
        key: "delete:transaction",
      },
    ],
  },
];

type Props = {
  defaultPers?: string[];
  permissions?: string[];
  onPermissionsChange?: (permissions: string[]) => void;
  disabled?: boolean;
};

const PermissionComponent = ({
  defaultPers,
  permissions,
  onPermissionsChange,
  disabled,
}: Props) => {
  const [pers, setPers] = React.useState<string[]>(
    permissions ?? defaultPers ?? []
  );

  const hasPer = (key: string) => {
    return !!pers.find((k) => key === k);
  };

  return (
    <Accordion type="multiple" className="w-full">
      {permissionData.map((p) => (
        <AccordionItem value={p.name} key={p.name}>
          <AccordionTrigger>{p.name}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <table>
              <tbody>
                <tr>
                  <td className="text-start" rowSpan={2}>
                    {p.description}
                  </td>
                  {p.pers.map((l) => (
                    <td className="text-center px-2 pb-2" key={l.key}>
                      {l.label}
                    </td>
                  ))}
                </tr>
                <tr>
                  {p.pers.map((l) => (
                    <td className="text-center px-2 pb-2" key={l.key}>
                      <Checkbox
                        disabled={disabled}
                        checked={hasPer(l.key)}
                        onCheckedChange={(checked) => {
                          const newPers = checked
                            ? Array.from(new Set([...pers, l.key]))
                            : Array.from(
                                new Set(pers.filter((k) => k !== l.key))
                              );
                          setPers(newPers);
                          if (onPermissionsChange) {
                            onPermissionsChange(newPers);
                          }
                        }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PermissionComponent;
