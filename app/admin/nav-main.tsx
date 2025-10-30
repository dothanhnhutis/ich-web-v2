"use client";

import {
  ChevronRight,
  LayoutDashboardIcon,
  type LucideIcon,
  ShieldUserIcon,
  WarehouseIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/components/user-context";

type NavItem =
  | {
      title: string;
      url: string;
      icon: LucideIcon;
      activeRegex: RegExp;
      permission: string;
    }
  | {
      title: string;
      icon: LucideIcon;
      activeRegex: RegExp;
      items: {
        title: string;
        url: string;
        activeRegex: RegExp;
        permission: string;
      }[];
    };

const navItems: NavItem[] = [
  {
    title: "Trung tâm kho hàng",
    icon: LayoutDashboardIcon,
    activeRegex: /^\/admin$/,
    url: "/admin",
    permission: "admin",
  },
  {
    title: "Người dùng & vai  trò",
    icon: ShieldUserIcon,
    activeRegex: /^\/admin\/(?:users|roles)(?:[0-9a-zA-Z/-])*?$/,
    items: [
      {
        title: "Người dùng",
        url: "/admin/users",
        activeRegex: /^\/admin\/users(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:user",
      },
      {
        title: "Vai Trò",
        url: "/admin/roles",
        activeRegex: /^\/admin\/roles(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:role",
      },
    ],
  },
  {
    title: "Trung tâm kho hàng",
    icon: WarehouseIcon,
    activeRegex: /^\/admin\/(?:warehouses|packagings|note)(?:[0-9a-zA-Z/-])*?$/,
    items: [
      {
        title: "Kho Hàng",
        url: "/admin/warehouses",
        activeRegex: /^\/admin\/warehouses(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:warehouse:*",
      },
      {
        title: "Bao Bì",
        url: "/admin/packagings",
        activeRegex: /^\/admin\/packagings(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:packaging:*",
      },
      {
        title: "Nguyên Liệu",
        url: "/admin/packagings",
        activeRegex: /^\/admin\/packagings(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:packaging:*",
      },
      {
        title: "Thành Phẩm",
        url: "/admin/packagings",
        activeRegex: /^\/admin\/packagings(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:packaging:*",
      },
      {
        title: "Phiếu",
        url: "/admin/notes",
        activeRegex: /^\/admin\/notes(?:[0-9a-zA-Z/-])*?$/,
        permission: "read:note:*",
      },
    ],
  },
];

function filterMenu(permissions: string[]): NavItem[] {
  return navItems
    .map((item) => {
      // Nếu có items con → lọc tiếp
      if ("items" in item) {
        const filteredItems = item.items.filter((sub) =>
          permissions.includes(sub.permission)
        );
        return filteredItems.length > 0
          ? { ...item, items: filteredItems }
          : null;
      }
      // Nếu là item trực tiếp → check permission (nếu có)
      if (permissions.includes(item.permission)) {
        return item;
      }
      return null;
    })
    .filter((i) => i !== null);
}

export function NavMain() {
  const pathname = usePathname();
  const { permissions, user } = useUser();

  if (!user)
    return (
      <div className="relative flex w-full min-w-0 flex-col p-2">
        <div className=" flex items-center h-8">
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col relative">
            <Skeleton className="h-8 full rounded-md" />
            <div className="flex flex-col gap-1 mx-3.5 border-l translate-x-px border-sidebar-border px-2.5 py-0.5">
              <Skeleton className="h-7 w-full rounded-md" />
              <Skeleton className="h-7 w-full rounded-md" />
            </div>
          </div>
          <div className="flex flex-col relative">
            <Skeleton className="h-8 full rounded-md" />
            <div className="flex flex-col gap-1 mx-3.5 border-l translate-x-px border-sidebar-border px-2.5 py-0.5">
              <Skeleton className="h-7 w-full rounded-md" />
              <Skeleton className="h-7 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 full rounded-md" />
        </div>
      </div>
    );

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Chức năng chính</SidebarGroupLabel>
      <SidebarMenu>
        {filterMenu(permissions).map((i) =>
          "items" in i ? (
            <Collapsible
              key={i.title}
              asChild
              defaultOpen={i.activeRegex.test(pathname)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    isActive={i.activeRegex.test(pathname)}
                    tooltip={i.title}
                  >
                    <i.icon />
                    <span>{i.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {i.items.map((ii) => (
                      <SidebarMenuSubItem key={ii.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={ii.activeRegex.test(pathname)}
                        >
                          <Link href={ii.url}>
                            <span>{ii.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={i.title}>
              <SidebarMenuButton
                asChild
                isActive={i.activeRegex.test(pathname)}
              >
                <Link href={i.url}>
                  <i.icon />
                  <span>{i.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
