import covers from "@/cover.json";
import Social from "@/components/molecules/Social";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Home() {
  return (
    <div className="max-w-250 mt-10 flex flex-col md:flex-row gap-10">
      <Carousel className="bg-transparent dark:bg-zinc-900 overflow-hidden h-100 md:max-w-100 rounded-2xl border-2 grid place-items-center">
        <CarouselContent>
          {covers.map((cover) => {
            return (
              <CarouselItem key={cover.id} className="grid place-items-center">
                <img
                  src={`./img/cover/${cover.image}`}
                  className="object-cover object-center h-100"
                  alt={cover.alt}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <section id="about" className="py-10">
        <div className="flex flex-col gap-10 mx-auto">
          <div className="flex flex-col gap-5 flex-2">
            <h2 className="text-2xl font-black text-cyan-700 dark:text-zinc-300">
              Welcome!
            </h2>
            <Social />
            <p className="text-muted-foreground text-justify mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sint
              officiis pariatur iusto reiciendis amet maxime totam? Doloribus
              rerum pariatur earum nostrum illo amet harum, mollitia magni
              voluptate vero inventore eos. Commodi qui dolorum, earum tempora
              ea quod doloremque consectetur sit modi fugiat itaque quis neque
              fugit. Sint aliquam vero ipsam placeat. Sapiente, nesciunt dolore
              porro necessitatibus quis doloribus quam tempora.
            </p>
          </div>
          <div className="flex flex-col gap-2 px-10"></div>
        </div>
      </section>
    </div>
  );
}

export default Home;
