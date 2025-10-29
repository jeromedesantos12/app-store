import { Clover } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link
      to="/"
      className="font-bold font-saira text-shadow-2xl text-2xl text-cyan-700 dark:text-cyan-500 flex flex-row items-center justify-center gap-3"
    >
      <Clover />
      <span>My Store</span>
    </Link>
  );
}

export default Logo;
