import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

function Social() {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:bg-cyan-700 dark:hover-bg-cyan-500  bg-cyan-500 rounded-full transition-all duration-300 hover:bg-cyan-700 dark:hover:bg-cyan-500"
      >
        <Github />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:bg-cyan-700  bg-cyan-500 dark:hover-bg-cyan-500 border-box rounded-full transition-all duration-300 hover:bg-cyan-700 dark:hover:bg-cyan-500"
      >
        <Linkedin />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:bg-cyan-700  bg-cyan-500 dark:hover-bg-cyan-500 border-box rounded-full transition-all duration-300 hover:bg-cyan-700 dark:hover:bg-cyan-500"
      >
        <Instagram />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:bg-cyan-700  bg-cyan-500 dark:hover-bg-cyan-500 border-box rounded-full transition-all duration-300 hover:bg-cyan-700 dark:hover:bg-cyan-500"
      >
        <Twitter />
      </a>
    </div>
  );
}

export default Social;
