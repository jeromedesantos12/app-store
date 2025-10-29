import { Info } from "lucide-react";

function Empty({ modelName }: { modelName: string }) {
  const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  return (
    <p className="text-lg font-bold dark:text-zinc-300 text-cyan-700 text-center mt-10">
      <div className="flex gap-2">
        <Info />
        <p className="text-lg font-bold">{name} is Empty</p>
      </div>
    </p>
  );
}

export default Empty;
