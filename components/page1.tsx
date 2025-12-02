"use client";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ChevronsUpDown,
} from "lucide-react";
import React from "react";
import calcPages from "@/lib/calcPages";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import {
  PaginationContent,
  Pagination as PaginationDefault,
  PaginationEllipsis,
  PaginationItem,
} from "./ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

const itemPerPages = ["10", "20", "30", "40", "50", "All"];

type PaginationProps = {
  metadata?: Metadata;
  defaultSearchParamsString?: string;
  searchParamsString?: string;
  onPageChange?: (value: string) => void;
};
const Pagination = ({
  metadata,
  searchParamsString,
  defaultSearchParamsString,
  onPageChange,
}: PaginationProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchParams, setSearchParams] = React.useState<URLSearchParams>(
    new URLSearchParams(searchParamsString ?? defaultSearchParamsString ?? "")
  );
  const [itemPerPage, setItemPerPage] = React.useState<string>("10");

  React.useEffect(() => {
    setSearchParams(new URLSearchParams(searchParamsString));
  }, [searchParamsString]);

  React.useEffect(() => {
    if (metadata) setItemPerPage(`${metadata.limit}`);
  }, [metadata]);

  if (!metadata) {
    return (
      <div className="flex items-center text-sm @container">
        <Skeleton className="shrink-0 hidden @2xl:block h-3 w-10" />

        <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
          <div className="@2xl:flex gap-2 items-center hidden">
            <p className="shrink-0">Hàng trên mỗi trang</p>
            <Skeleton className="h-9 w-10" />
          </div>

          <Skeleton className="@2xl:hidden h-3 w-10" />

          <div className="flex items-center gap-2 @2xl:hidden">
            <Skeleton className=" h-9 w-9" />
            <Skeleton className=" h-9 w-9" />
            <Skeleton className=" h-9 w-9" />
            <Skeleton className=" h-9 w-9" />
          </div>
          <PaginationDefault className="w-auto mx-0 hidden @2xl:flex">
            <PaginationContent>
              <PaginationItem>
                <Skeleton className=" h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className=" h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className=" h-9 w-9" />
              </PaginationItem>
              <PaginationItem>
                <Skeleton className=" h-9 w-9" />
              </PaginationItem>
            </PaginationContent>
          </PaginationDefault>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center text-sm @container">
      <p className="shrink-0 hidden @2xl:block">
        {`${metadata.itemStart} - ${metadata.itemEnd} / ${metadata.totalItem} Kết quả`}
      </p>

      <div className="flex gap-8 items-center justify-between w-full @2xl:ml-auto @2xl:w-auto @2xl:justify-normal">
        <div className="@2xl:flex gap-2 items-center hidden">
          <p className="shrink-0">Hàng trên mỗi trang</p>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[70px] justify-between"
              >
                {itemPerPage}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[70px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {itemPerPages.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={(currentValue) => {
                          setItemPerPage(currentValue);
                          setOpen(false);
                          const newSearchParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          newSearchParams.set("page", "1");
                          if (currentValue === "All") {
                            newSearchParams.delete("limit");
                          } else {
                            newSearchParams.set("limit", currentValue);
                          }
                          setSearchParams(newSearchParams);
                          if (onPageChange) {
                            onPageChange(newSearchParams.toString());
                          }
                        }}
                      >
                        {item}
                        <CheckIcon
                          className={cn(
                            "ml-auto",
                            itemPerPage === item ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}

                    {!itemPerPages.includes(itemPerPage) ? (
                      <CommandItem
                        value={itemPerPage}
                        onSelect={(currentValue) => {
                          setItemPerPage(currentValue);
                          setOpen(false);
                          const newSearchParams = new URLSearchParams(
                            searchParams.toString()
                          );
                          newSearchParams.set("page", "1");
                          if (currentValue === "All") {
                            newSearchParams.delete("limit");
                          } else {
                            newSearchParams.set("limit", currentValue);
                          }
                          setSearchParams(newSearchParams);
                          if (onPageChange) {
                            onPageChange(newSearchParams.toString());
                          }
                        }}
                      >
                        {itemPerPage}
                        <CheckIcon className="ml-auto opacity-100" />
                      </CommandItem>
                    ) : null}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <p className="@2xl:hidden">
          {`Trang ${
            metadata.itemEnd > 0
              ? Math.ceil(metadata.itemEnd / metadata.limit)
              : 0
          } / ${metadata.totalPage}`}
        </p>

        <div className="flex items-center gap-2 @2xl:hidden">
          <Button
            disabled={metadata.itemStart <= 1}
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", "1");
              setSearchParams(newSearchParams);
              if (onPageChange) {
                onPageChange(newSearchParams.toString());
              }
            }}
          >
            <ChevronsLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            disabled={metadata.itemStart <= 1}
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              const currentPage =
                Math.ceil(metadata.itemEnd / metadata.limit) - 1;
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", currentPage.toString());
              setSearchParams(newSearchParams);
              if (onPageChange) {
                onPageChange(newSearchParams.toString());
              }
            }}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            disabled={
              metadata.totalPage === 0 ||
              metadata.totalPage.toString() === searchParams.get("page")
            }
            onClick={() => {
              const currentPage =
                Math.ceil(metadata.itemEnd / metadata.limit) + 1;
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", currentPage.toString());
              setSearchParams(newSearchParams);
              if (onPageChange) {
                onPageChange(newSearchParams.toString());
              }
            }}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
          <Button
            disabled={
              metadata.totalPage === 0 ||
              metadata.totalPage.toString() === searchParams.get("page")
            }
            variant={"outline"}
            size={"icon"}
            onClick={() => {
              const newSearchParams = new URLSearchParams(
                searchParams.toString()
              );
              newSearchParams.set("page", metadata.totalPage.toString());
              setSearchParams(newSearchParams);
              if (onPageChange) {
                onPageChange(newSearchParams.toString());
              }
            }}
          >
            <ChevronsRightIcon className="w-4 h-4" />
          </Button>
        </div>
        <PaginationDefault className="w-auto mx-0 hidden @2xl:flex">
          <PaginationContent>
            <PaginationItem>
              <Button
                disabled={metadata.itemStart <= 1}
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  const currentPage =
                    Math.ceil(metadata.itemEnd / metadata.limit) - 1;
                  const newSearchParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newSearchParams.set("page", currentPage.toString());
                  setSearchParams(newSearchParams);
                  if (onPageChange) {
                    onPageChange(newSearchParams.toString());
                  }
                }}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
            </PaginationItem>

            {calcPages({
              totalPage: metadata.totalPage,
              currPage: Math.ceil(metadata.itemEnd / metadata.limit),
              // totalPage: 10,
              // currPage: 5,
            }).map((p) => {
              if (p === "…")
                return (
                  <PaginationItem key={p}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              if (p.toString() === searchParams.get("page"))
                return (
                  <PaginationItem key={p}>
                    <button
                      type="button"
                      className="h-9 w-9 shrink-0 text-center align-middle border rounded-md text-primary border-primary"
                    >
                      {p}
                    </button>
                  </PaginationItem>
                );
              return (
                <PaginationItem key={p}>
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => {
                      const newSearchParams = new URLSearchParams(
                        searchParams.toString()
                      );
                      newSearchParams.set("page", p.toString());
                      setSearchParams(newSearchParams);
                      if (onPageChange) {
                        onPageChange(newSearchParams.toString());
                      }
                    }}
                  >
                    {p}
                  </Button>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <Button
                variant={"outline"}
                size={"icon"}
                disabled={!metadata.hasNextPage}
                onClick={() => {
                  const currentPage =
                    Math.ceil(metadata.itemEnd / metadata.limit) + 1;
                  const newSearchParams = new URLSearchParams(
                    searchParams.toString()
                  );
                  newSearchParams.set("page", currentPage.toString());
                  setSearchParams(newSearchParams);
                  if (onPageChange) {
                    onPageChange(newSearchParams.toString());
                  }
                }}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </PaginationDefault>
      </div>
    </div>
  );
};

export default Pagination;
