import { Info } from "lucide-react";
import { Button } from "../ui/button";

function ButtonError() {
  return (
    <Button variant="destructive" disabled>
      <Info />
    </Button>
  );
}

export default ButtonError;
