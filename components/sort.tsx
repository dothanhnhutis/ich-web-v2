import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

const genDefaultValue = (
  data: Record<string, { title: string; description: string }>
) => {
  return Object.keys(data).reduce<
    Record<string, { isOn: boolean; dir: string }>
  >((prev, curr) => {
    prev[curr] = {
      isOn: false,
      dir: "asc",
    };
    return prev;
  }, {});
};

const SortComponent = ({
  data,
}: {
  data: Record<string, { title: string; description: string }>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = React.useState<boolean>(false);
  const [sorts, setSorts] = React.useState<
    Record<string, { isOn: boolean; dir: string }>
  >(genDefaultValue(data));

  // cập nhật lại dữ liệu
  React.useEffect(() => {
    setOpen(false);
    const sorts = searchParams.getAll("sort");
    sorts.forEach((s) => {
      const [k, v] = s.split(".");
      setSorts((prev) => ({ ...prev, [k]: { isOn: true, dir: v } }));
    });
  }, [searchParams]);

  const hasSort = React.useCallback(
    (key: string, dir?: string) => {
      if (sorts[key]) {
        return dir
          ? sorts[key].dir === dir && sorts[key].isOn
          : sorts[key].isOn;
      }
      return false;
    },
    [sorts]
  );

  const handleResetSorts = React.useCallback(() => {
    const sortValues = searchParams.getAll("sort");

    const newSorts = genDefaultValue(data);

    sortValues.forEach((v) => {
      const [key, dir] = v.split(".");
      newSorts[key] = {
        isOn: true,
        dir,
      };
    });

    setSorts(newSorts);
  }, [searchParams, data]);

  const handleSorts = React.useCallback(() => {
    // kiểm tra sort có thay đổi không
    const oldSorts = searchParams.getAll("sort");
    const notChange = Object.keys(sorts).every((key) => {
      const s = oldSorts.find((s) => s.startsWith(key));
      return s
        ? sorts[key].isOn && sorts[key].dir === s.split(".")[1]
        : !sorts[key].isOn;
    });

    if (notChange) {
      setOpen(false);
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("sort");
      Object.keys(sorts).forEach((k) => {
        if (sorts[k].isOn) {
          newSearchParams.append("sort", `${k}.${sorts[k].dir}`);
        }
      });
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [router, searchParams, pathname, sorts]);

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleResetSorts();
        setOpen(isOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <SlidersHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" side="bottom" align="end">
        <DropdownMenuLabel>Sắp xếp</DropdownMenuLabel>

        {Object.keys(data).map((key) => (
          <React.Fragment key={key}>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-2 p-1">
              <div className="flex gap-2 justify-between items-center">
                <Label>{data[key].title}</Label>
                <Switch
                  checked={hasSort(key)}
                  onCheckedChange={(isOn) => {
                    setSorts((prev) => ({
                      ...prev,
                      [key]: {
                        ...prev[key],
                        isOn,
                      },
                    }));
                  }}
                />
              </div>
              <div className="flex gap-2 items-center justify-between">
                <p className="text-sm">{data[key].description}</p>
                <ToggleGroup
                  variant="outline"
                  type="single"
                  disabled={!hasSort(key)}
                  value={sorts[key].dir}
                  onValueChange={(v) => {
                    if (v !== "")
                      setSorts((prev) => ({
                        ...prev,
                        [key]: {
                          ...prev[key],
                          dir: v,
                        },
                      }));
                  }}
                >
                  <ToggleGroupItem value="asc" aria-label="asc">
                    <p>Tăng</p>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="desc" aria-label="desc">
                    <p>Giảm</p>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </React.Fragment>
        ))}

        <DropdownMenuSeparator />
        <div className="flex items-center justify-between">
          <Button type="button" variant={"outline"} onClick={handleResetSorts}>
            Đặt lại
          </Button>
          <Button onClick={handleSorts}>Áp dụng</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortComponent;
