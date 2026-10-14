
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const slides = [
  "/images/in1.jpg",
  "/images/in2.png",
  "/images/in3.jpg",
  "/images/in4.webp",
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[580px] items-center overflow-hidden bg-[var(--paper)] py-20 sm:min-h-[620px] sm:py-24">
      <div className="hero-slideshow absolute inset-0 -z-10 bg-[var(--paper)]">
        {slides.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            className={index === activeSlide ? "active" : ""}
          />
        ))}
        <div className="absolute inset-0 bg-[#0b1d17]/65" />
      </div>

      <div className="pointer-events-none absolute inset-0 -z-0 opacity-30">
        <svg
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          {[60, 140, 220, 300, 380, 460].map((y) => (
            <path
              key={y}
              d={`M0,${y} C200,${y - 40} 400,${y + 40} 600,${y} S1000,${y - 40} 1200,${y}`}
              fill="none"
              stroke="#bfdcc9"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      <div className="wrap relative z-10 grid w-full items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div>
          <p className="mb-4 text-sm font-semibold text-[#bfdcc9]">
            A collaborative initiative of Verneldos &amp; Ntonarche
          </p>

          <h1 className="mb-6 max-w-[14ch] text-4xl font-semibold leading-tight text-[#bb9222] sm:text-5xl lg:text-[3.25rem]">
            Modern farming support for every farmer.
          </h1>

          <p className="max-w-2xl text-base leading-8 text-[#f0f6f3] sm:text-lg">
            Agro Trade Hub Africa connects farmers, cooperatives and
            agribusinesses to practical solutions, stronger market access,
            and sustainable agricultural growth across Nigeria through a
            coordinated national network.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/membership" className="btn btn-primary">
              Join Agro Trade Hub Africa
              <ArrowRight size={17} />
            </a>

            <a
              href="/services"
              className="btn border-white bg-white text-[#0b1d17] hover:border-[#d9b648] hover:bg-[#d9b648]"
            >
              Our Services
            </a>
          </div>
        </div>

        <div className="bg-[#0b1d17]/90 p-[2px] text-white">
          <div className="border border-white/15 px-8 py-10 sm:px-9">
            <p className="mb-2 text-sm font-semibold text-[#bfdcc9]">
              Coordinator network
            </p>

            <p className="font-serif text-6xl leading-none">37</p>

            <p className="mb-0 mt-4 text-sm leading-7 text-[#d9e6dd]">
              States and the FCT, each with a coordinator and secretary
              on the ground.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
