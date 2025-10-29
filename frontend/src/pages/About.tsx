import Logo from "@/components/molecules/Logo";
import Social from "@/components/molecules/Social";

function About() {
  return (
    <div className="bg-white dark:bg-zinc-900 flex gap-4 flex-col max-w-100 md:flex-row md:max-w-220 rounded-2xl border-2">
      <div className="p-10 flex flex-col gap-5 flex-2">
        <h1 className="text-2xl font-black text-cyan-700 dark:text-zinc-300">
          About Us
        </h1>
        <p className="text-justify text-muted-foreground mb-5">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint
          officiis pariatur iusto reiciendis amet maxime totam? Doloribus rerum
          pariatur earum nostrum illo amet harum, mollitia magni voluptate vero
          inventore eos. Commodi qui dolorum, earum tempora ea quod doloremque
          consectetur sit modi fugiat itaque quis neque fugit. Sint aliquam vero
          ipsam placeat. Sapiente, nesciunt dolore porro necessitatibus quis
          doloribus quam tempora.
        </p>
        <Social />
      </div>
      <div className="p-10">
        <div className="cursor-pointer bg-transparent flex flex-col items-center rounded-2xl overflow-hidden shadow-lg group">
          <img
            src="img/profile/jeremy.jpg"
            className="object-cover object-center h-70 transition-all duration-300 group-hover:scale-102"
            alt="Profile picture"
          />
          <section className="border-box px-2 py-4 bg-transparent dark:bg-zinc-800 z-10 w-full flex flex-col items-center transition-all duration-300 group-hover:bg-muted">
            <Logo />
            <p className="text-center text-muted-foreground">
              Unlock your future dream
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
