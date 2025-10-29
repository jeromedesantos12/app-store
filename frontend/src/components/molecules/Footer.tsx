import SocialFooter from "./SocialFooter";

function Footer() {
  return (
    <footer className="bg-cyan-700 dark:bg-zinc-900 w-full pt-10 pb-10 mt-20">
      <SocialFooter />
      <p className="text-white dark:text-zinc-300 hover:text-secondary-light text-sm text-center transition duration-300 ease-in-out">
        Made with &#9829; by{" "}
        <a
          href="https://github.com/jeromedesantos12"
          className="font-bold"
          target="_blank"
        >
          Jeremy Santoso
        </a>
      </p>
    </footer>
  );
}

export default Footer;
