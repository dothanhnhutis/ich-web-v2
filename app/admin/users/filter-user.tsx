"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  MailIcon,
  SearchIcon,
  UserSearchIcon,
  XIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import SortUser from "./sort-user";

const statusData = [
  {
    label: "Hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Vô hiệu hoá",
    value: "INACTIVE",
  },
];

const FilterUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchEmail, setSearchEmail] = React.useState<string>("");
  const [searchUsername, setSearchUsername] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>("");

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const paramSetters = {
      email: setSearchEmail,
      username: setSearchUsername,
      status: setStatus,
    };
    // cập nhật dữ liệu
    Object.entries(paramSetters).forEach(([key, setter]) => {
      setter(newSearchParams.get(key) || "");
    });
  }, [searchParams]);

  return (
    <div className="relative grid gap-4 border rounded-md p-3">
      <Label>Bộ lọc</Label>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kím bằng email"
            value={searchEmail}
            onChange={(e) => {
              setSearchEmail(e.target.value);
            }}
          />
          <InputGroupAddon>
            <MailIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn("p-0", searchEmail.length === 0 ? "hidden" : "block")}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchEmail("");
                if (newSearchParams.has("email")) {
                  newSearchParams.delete("email");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`/admin/users?${newSearchParams.toString()}`);
                }
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
                const newSearchParams = new URLSearchParams(searchParams);
                if (searchEmail !== "") {
                  if (newSearchParams.has("username")) {
                    newSearchParams.delete("username");
                    setSearchUsername("");
                  }
                  newSearchParams.set("email", searchEmail);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                } else {
                  newSearchParams.delete("email");
                }
                router.push(`/admin/users?${newSearchParams.toString()}`);
              }}
            >
              <SearchIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kím bằng tên"
            value={searchUsername}
            onChange={(e) => {
              setSearchUsername(e.target.value);
            }}
          />
          <InputGroupAddon>
            <UserSearchIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn(
              "p-0",
              searchUsername.length === 0 ? "hidden" : "block"
            )}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchUsername("");
                if (newSearchParams.has("username")) {
                  newSearchParams.delete("username");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`/admin/users?${newSearchParams.toString()}`);
                }
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
                const newSearchParams = new URLSearchParams(searchParams);
                if (searchUsername !== "") {
                  if (newSearchParams.has("email")) {
                    newSearchParams.delete("email");
                    setSearchEmail("");
                  }
                  newSearchParams.set("username", searchUsername);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                } else {
                  newSearchParams.delete("username");
                }
                router.push(`/admin/users?${newSearchParams.toString()}`);
              }}
            >
              <SearchIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <div className="relative flex gap-4 items-center w-full sm:w-[180px]">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex w-full shrink justify-between hover:bg-transparent text-start text-sm font-normal",
                  status === ""
                    ? "text-muted-foreground hover:text-muted-foreground"
                    : "hover:text-foreground"
                )}
              >
                <span>
                  {status === ""
                    ? "Trạng thái"
                    : status === "ACTIVE"
                    ? "Hoạt động"
                    : "Vô hiệu hoá"}
                </span>
                <ChevronDownIcon className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]"
              align="end"
              side="bottom"
            >
              <Command>
                <CommandList>
                  <CommandGroup heading="Trạng thái">
                    {statusData.map((s) => (
                      <CommandItem
                        key={s.label}
                        value={s.value}
                        onSelect={(currentValue) => {
                          setStatus(
                            currentValue === status ? "" : currentValue
                          );
                          setOpen(false);

                          const newSearchParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          if (currentValue === status) {
                            newSearchParams.delete("status");
                          } else {
                            newSearchParams.set("status", currentValue);
                          }
                          newSearchParams.set("page", "1");
                          newSearchParams.set("limit", "10");
                          router.push(
                            `/admin/users?${newSearchParams.toString()}`
                          );
                        }}
                      >
                        {s.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto",
                            status === s.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <SortUser />
        </div>
      </div>
    </div>
  );
};

export default FilterUser;
