import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";

function ButtonLoading() {
  return (
    <Button disabled className="flex-1">
      <LoaderCircle className="animate-spin" />
    </Button>
  );
}

export default ButtonLoading;
