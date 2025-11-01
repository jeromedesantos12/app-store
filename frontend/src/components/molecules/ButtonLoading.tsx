import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function ButtonLoading({ className }: { className?: string }) {
  return (
    <Button disabled className={cn(className)}>
      <LoaderCircle className="animate-spin" />
    </Button>
  );
}

export default ButtonLoading;
