import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

function Social() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-5">
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:text-zinc-300 bg-transparent dark:hover:bg-zinc-700 rounded-full transition-all duration-300 hover:bg-cyan-500 border-2 border-white"
      >
        <Github />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:text-zinc-300 bg-transparent dark:hover:bg-zinc-700 border-box rounded-full  transition-all duration-300 hover:bg-cyan-500 border-2 border-white"
      >
        <Linkedin />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:text-zinc-300 bg-transparent dark:hover:bg-zinc-700  border-box rounded-full transition-all duration-300 hover:bg-cyan-500 border-2 border-white"
      >
        <Instagram />
      </a>
      <a
        href="#"
        className="grid place-items-center w-10 h-10 text-white dark:text-zinc-300 bg-transparent dark:hover:bg-zinc-700  border-box rounded-full  transition-all duration-300 hover:bg-cyan-500 border-2 border-white"
      >
        <Twitter />
      </a>
    </div>
  );
}

export default Social;
