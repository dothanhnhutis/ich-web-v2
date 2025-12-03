"use client";

import {
  BrickWallShieldIcon,
  CaptionsIcon,
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import SortComponent from "@/components/sort";
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
import { sortRoleData } from "@/constants";
import { cn } from "@/lib/utils";

const statusData = [
  {
    label: "Hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Vô hiệu hoá",
    value: "DISABLED",
  },
];

const RoleFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [searchName, setSearchName] = React.useState<string>("");
  const [searchDescription, setSearchDescription] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>("");

  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const paramSetters = {
      name: setSearchName,
      description: setSearchDescription,
      status: setStatus,
    };
    // cập nhật dữ liệu
    Object.entries(paramSetters).forEach(([key, setter]) => {
      setter(newSearchParams.get(key) || "");
    });
  }, [searchParams]);

  return (
    <div className="relative grid gap-4 border rounded-lg p-3">
      <Label>Bộ lọc</Label>
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kiếm bằng tên vai trò"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              const newSearchParams = new URLSearchParams(searchParams);
              if (newSearchParams.has("name")) {
                newSearchParams.delete("name");
                newSearchParams.set("page", "1");
                newSearchParams.set("limit", "10");
                router.push(`${pathName}?${newSearchParams.toString()}`);
              }
            }}
          />
          <InputGroupAddon>
            <BrickWallShieldIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn("p-0", searchName.length === 0 ? "hidden" : "block")}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchName("");
                if (newSearchParams.has("name")) {
                  newSearchParams.delete("name");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`${pathName}?${newSearchParams.toString()}`);
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
                if (searchName !== "") {
                  if (newSearchParams.has("description")) {
                    newSearchParams.delete("description");
                    setSearchDescription("");
                  }
                  newSearchParams.set("name", searchName);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                } else {
                  newSearchParams.delete("name");
                }
                router.push(`${pathName}?${newSearchParams.toString()}`);
              }}
            >
              <SearchIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput
            type="text"
            placeholder="Tìm kiếm bằng mô tả"
            value={searchDescription}
            onChange={(e) => {
              setSearchDescription(e.target.value);
              const newSearchParams = new URLSearchParams(searchParams);
              if (newSearchParams.has("description")) {
                newSearchParams.delete("description");
                newSearchParams.set("page", "1");
                newSearchParams.set("limit", "10");
                router.push(`${pathName}?${newSearchParams.toString()}`);
              }
            }}
          />
          <InputGroupAddon>
            <CaptionsIcon />
          </InputGroupAddon>
          <InputGroupAddon
            align="inline-end"
            className={cn(
              "p-0",
              searchDescription.length === 0 ? "hidden" : "block"
            )}
          >
            <button
              type="button"
              className=" p-2"
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                setSearchDescription("");
                if (newSearchParams.has("description")) {
                  newSearchParams.delete("description");
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                  router.push(`${pathName}?${newSearchParams.toString()}`);
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
                if (searchDescription !== "") {
                  if (newSearchParams.has("name")) {
                    newSearchParams.delete("name");
                    setSearchName("");
                  }
                  newSearchParams.set("description", searchDescription);
                  newSearchParams.set("page", "1");
                  newSearchParams.set("limit", "10");
                } else {
                  newSearchParams.delete("description");
                }
                router.push(`${pathName}?${newSearchParams.toString()}`);
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
                            `${pathName}?${newSearchParams.toString()}`
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

          <SortComponent data={sortRoleData} />
        </div>
      </div>
    </div>
  );
};

export default RoleFilter;
