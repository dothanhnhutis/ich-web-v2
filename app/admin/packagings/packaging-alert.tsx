import { TriangleAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type PackagingAlertProps = {
  min_stock_level?: number;
  total_quantity: number;
};

const PackagingAlert = ({
  min_stock_level,
  total_quantity,
}: PackagingAlertProps) => {
  if (!min_stock_level || total_quantity / min_stock_level >= 2) return;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TriangleAlertIcon
          className={cn(
            "size-4",
            total_quantity / min_stock_level <= 1
              ? "text-destructive"
              : "text-orange-300"
          )}
        />
      </TooltipTrigger>
      <TooltipContent side="right" align="center" className="max-w-30">
        {total_quantity / min_stock_level <= 1 ? (
          <p>Số lượng tồn kho đang ở mức thấp</p>
        ) : (
          <p>Số lượng bao bì tồn kho đang ở mức trung bình</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

export default PackagingAlert;
