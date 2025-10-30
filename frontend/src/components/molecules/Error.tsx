import { ShieldBan } from "lucide-react";

function Error({ error }: { error: string }) {
  return (
    <div className="text-lg font-bold text-destructive text-center mt-10 flex justify-center items-center gap-2">
      <ShieldBan />
      <span>{error}</span>
    </div>
  );
}

export default Error;
