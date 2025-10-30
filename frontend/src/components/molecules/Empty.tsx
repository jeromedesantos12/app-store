import { Info } from "lucide-react";

function Empty({ modelName }: { modelName: string }) {
  const name = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  return (
    <div className="text-lg font-bold dark:text-zinc-300 text-cyan-700 text-center mt-10 flex justify-center items-center gap-2">
      <Info />
      <span>{name} is Empty</span>
    </div>
  );
}

export default Empty;
