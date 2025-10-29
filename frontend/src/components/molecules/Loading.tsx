import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <p className="text-lg font-bold dark:text-zinc-300 text-cyan-700 text-center mt-10 flex justify-center items-center gap-2">
      <LoaderCircle className="animate-spin" /> loading...
    </p>
  );
}

export default Loading;
