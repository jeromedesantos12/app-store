import covers from "@/cover.json";
import Social from "@/components/molecules/Social";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Truck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* ===== HERO SECTION ===== */}
      <section className="max-w-7xl mt-10 px-5 md:px-20 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col text-center md:text-left gap-5 md:w-1/2">
          <h1 className="text-3xl md:text-5xl font-black text-cyan-700 dark:text-zinc-100">
            Temukan Gaya Terbaikmu di{" "}
            <span className="text-cyan-500 font-saira">My Store</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            Pilihan outfit terbaik, kualitas tinggi, dan harga bersahabat untuk
            semua kalangan.
          </p>
          <div className="flex justify-center md:justify-start gap-3">
            <Link to="/product">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" /> Belanja Sekarang
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="cursor-pointer">
                Tentang Saya
              </Button>
            </Link>
          </div>
          <Social />
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Carousel className="bg-transparent dark:bg-zinc-900 overflow-hidden h-80 md:h-96 w-full rounded-2xl border-2 grid place-items-center">
            <CarouselContent>
              {covers.map((cover) => (
                <CarouselItem
                  key={cover.id}
                  className="grid place-items-center"
                >
                  <img
                    src={`./img/cover/${cover.image}`}
                    className="object-cover object-center w-full h-80 md:h-96"
                    alt={cover.alt}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section id="why" className="max-w-7xl py-20 px-5 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-10 text-cyan-700 dark:text-zinc-100">
          Kenapa Pilih My Store?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center gap-3">
            <Star className="text-yellow-400 w-10 h-10" />
            <h3 className="font-bold text-lg">Kualitas Premium</h3>
            <p className="text-muted-foreground">
              Semua produk kami terbuat dari bahan pilihan terbaik yang tahan
              lama dan nyaman.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Truck className="text-cyan-500 w-10 h-10" />
            <h3 className="font-bold text-lg">Pengiriman Cepat</h3>
            <p className="text-muted-foreground">
              Kami pastikan pesananmu sampai tepat waktu ke seluruh Indonesia.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-green-500 w-10 h-10" />
            <h3 className="font-bold text-lg">Garansi & Aman</h3>
            <p className="text-muted-foreground">
              Belanja tanpa khawatir, karena setiap produk bergaransi dan
              dikemas dengan aman.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="py-20 px-5 md:px-20 max-w-7xl bg-zinc-50 dark:bg-zinc-900"
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-cyan-700 dark:text-zinc-100">
            Tentang Kami
          </h2>
          <p className="text-muted-foreground text-justify leading-relaxed">
            My Store adalah toko online yang berfokus pada produk-produk fashion
            dan perlengkapan bergaya modern. Kami percaya bahwa setiap orang
            berhak tampil percaya diri dengan kualitas terbaik tanpa harus
            menguras dompet. Didirikan sejak 2020, kami terus berkembang dan
            dipercaya oleh ribuan pelanggan di seluruh Indonesia.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
