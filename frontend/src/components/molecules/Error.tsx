import { ShieldBan } from "lucide-react";

function Error({ error }: { error: string }) {
  return (
    <p className="text-lg font-bold text-destructive text-center mt-10">
      <div className="flex gap-2">
        <ShieldBan />
        <p className="text-lg font-bold">{error}</p>
      </div>
    </p>
  );
}

export default Error;
