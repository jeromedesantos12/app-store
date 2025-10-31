import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";

function ButtonLoading() {
  return (
    <Button disabled className="w-full">
      <LoaderCircle className="animate-spin" />
    </Button>
  );
}

export default ButtonLoading;
