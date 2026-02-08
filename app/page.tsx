import Image from "next/image";
import ScrollFrames from "./components/ScrollFrames";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start mx-auto">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Scroll para ver la animación
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Baja y verás la animación controlada por scroll.
          </p>
        </div>
      </main>

      {/* Sección de animación */}
      <ScrollFrames frameCount={191} />

      <section className="grid h-screen place-items-center bg-white dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-400">
          Fin de la demo
        </p>
      </section>
    </div>
  );
}
