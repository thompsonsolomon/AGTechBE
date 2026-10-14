import { useEffect, useState } from "react";
import {
  Images,
  Users,
  Sprout,
  GraduationCap,
  Tractor,
  Expand,
  X,
  MapPin,
  CalendarDays,
  Clock3,
  ArrowUpRight,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const categories = [
  { id: "executive", label: "Executive", icon: Users },
  { id: "farming", label: "Farming", icon: Sprout },
  { id: "training", label: "Training", icon: GraduationCap },
  { id: "community", label: "Community", icon: Users },
  { id: "fertilisers", label: "Fertilisers", icon: Sprout },
  { id: "machinery", label: "Machinery", icon: Tractor },
];

const galleryItems = [
  {
    id: 1,
    category: "executive",
    title: "Executive Stakeholder Meeting",
    description: "Executive meeting of ATHA stakeholders.",
    date: "18 September 2026",
    time: "12:33 PM",
    venue: "Gocity Group Workspace, 316 Nwaniba Road, Uyo, Akwa Ibom State",
    image: "/images/e3.jpg",
    alt: "Agro Trade Hub Africa executive stakeholders meeting",
  },
  {
    id: 2,
    category: "farming",
    title: "Farming in Action",
    description: "Cassava farming and field preparation activities.",
    date: "24 September 2026",
    time: "10:48 PM",
    venue: "Nko, Ugep, Cross River State",
    image: "/images/in1.jpg",
    alt: "Agricultural field activities in Cross River State",
  },
  {
    id: 3,
    category: "training",
    title: "Modern Farming Techniques",
    description: "Practical agricultural training and knowledge sharing.",
    date: "30 September 2026",
    time: "6:29 PM",
    venue: "Calabar, Cross River State",
    image: "/images/c2.jpeg",
    alt: "Participants learning modern farming techniques",
  },
  {
    id: 4,
    category: "training",
    title: "Agricultural Skills Development",
    description: "Building practical farming skills through hands-on learning.",
    date: "30 September 2026",
    time: "6:29 PM",
    venue: "Calabar, Cross River State",
    image: "/images/c1.jpeg",
    alt: "Agricultural training and skills development",
  },
  {
    id: 5,
    category: "community",
    title: "Kwande Executives",
    description: "Community leadership and agricultural collaboration.",
    date: "2 October 2026",
    time: "2:57 PM",
    venue: "Benue State",
    image: "/images/c3.jpeg",
    alt: "Kwande executives in Benue State",
  },
  {
    id: 6,
    category: "fertilisers",
    title: "Agricultural Inputs",
    description: "Explore agricultural inputs and products featured by the Hub.",
    date: "Details coming soon",
    time: "Details coming soon",
    venue: "Details coming soon",
    image: "/images/e3.jpg",
    alt: "Agricultural products and inputs",
  },
  {
    id: 7,
    category: "machinery",
    title: "Agricultural Equipment",
    description: "Explore machinery and equipment supporting modern agriculture.",
    date: "Details coming soon",
    time: "Details coming soon",
    venue: "Details coming soon",
    image: "/images/e3.jpg",
    alt: "Agricultural equipment and machinery",
  },
];

const categoryLabels = {
  executive: "Executive",
  farming: "Farming",
  training: "Training",
  community: "Community",
  fertilisers: "Fertilisers",
  machinery: "Machinery",
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageErrors, setImageErrors] = useState([]);

  const availableImages = galleryItems.filter(
    (item) => !imageErrors.includes(item.id)
  );

  const activeItems =
    activeCategory === "all"
      ? availableImages
      : availableImages.filter(
          (item) => item.category === activeCategory
        );

  const selectCategory = (category) => {
    setActiveCategory(category);

    if (category === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(category)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

 

  const openImage = (item) => setSelectedImage(item);

  const showNextImage = (direction) => {
    if (!selectedImage || activeItems.length < 2) return;

    const currentIndex = activeItems.findIndex(
      (item) => item.id === selectedImage.id
    );

    const nextIndex =
      (currentIndex + direction + activeItems.length) %
      activeItems.length;

    setSelectedImage(activeItems[nextIndex]);
  };

   useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }

      if (event.key === "ArrowRight") {
        showNextImage(1);
      }

      if (event.key === "ArrowLeft") {
        showNextImage(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, activeItems]);
  

  const formatCategory = (category) =>
    categoryLabels[category] || category;

  return (
   <>
   <Header />
    <main className="min-h-screen bg-white text-[#17251c]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#0b1d17]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,199,166,0.18),transparent_42%)]" />

        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/10 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/10 sm:h-96 sm:w-96" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:px-10 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-3 border border-[#8bc7a6]/30 bg-white/5 px-4 py-2 text-sm font-semibold tracking-wide text-[#a9d8b9]">
              <Images size={17} />
              LIFE AT AGRO TRADE HUB AFRICA
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-7xl">
              People, products,
              <span className="block text-[#a9d8b9]">
                and progress.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explore the people behind our mission, moments from
              the field, agricultural training, community activities
              and the products helping Nigerian agriculture grow.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => selectCategory("all")}
                className="inline-flex items-center gap-3 bg-[#d9b648] px-6 py-3.5 text-sm font-bold text-[#17251c] transition hover:bg-[#edd27a]"
              >
                Explore the gallery
                <ArrowUpRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => selectCategory("farming")}
                className="inline-flex items-center gap-2 border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
              >
                Discover farming
              </button>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/15 pt-7">
              <div>
                <p className="text-3xl font-semibold text-white">
                  {galleryItems.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm text-white/55">
                  Gallery entries
                </p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-white">06</p>
                <p className="mt-1 text-sm text-white/55">
                  Content categories
                </p>
              </div>

              <div>
                <p className="text-3xl font-semibold text-white">NG</p>
                <p className="mt-1 text-sm text-white/55">
                  Growing across Nigeria
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="absolute -inset-3 translate-x-2 translate-y-2 border border-[#d9b648]/40" />

            <div className="relative grid grid-cols-2 gap-3">
              <div className="relative col-span-2 overflow-hidden bg-[#20382d]">
                <img
                  src="/images/e3.jpg"
                  alt="Agro Trade Hub Africa stakeholders"
                  className="h-64 w-full object-cover sm:h-80"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d17]/85 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a9d8b9]">
                    Our people
                  </p>
                  <p className="mt-1 font-serif text-2xl text-white">
                    Working together
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-[#20382d]">
                <img
                  src="/images/in1.jpg"
                  alt="Agricultural activities in the field"
                  className="h-36 w-full object-cover sm:h-44"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1d17]/70 to-transparent" />
                <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                  Farming
                </span>
              </div>

              <div className="relative flex min-h-36 flex-col justify-between bg-[#d9b648] p-5 sm:min-h-44 sm:p-6">
                <Sprout size={28} className="text-[#0b1d17]" />
                <div>
                  <p className="font-serif text-2xl font-semibold text-[#0b1d17]">
                    Growing
                    <br />
                    together.
                  </p>
                  <p className="mt-2 text-xs font-medium text-[#0b1d17]/70">
                    People. Knowledge. Agriculture.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-right text-xs tracking-wide text-white/45">
              A closer look at our agricultural community
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto py-4 [scrollbar-width:thin]">
            <button
              type="button"
              onClick={() => selectCategory("all")}
              className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${
                activeCategory === "all"
                  ? "border-[#143a30] bg-[#143a30] text-white"
                  : "border-black/10 bg-white text-[#25352b] hover:border-[#2b6558]"
              }`}
            >
              <ImageIcon size={16} />
              All
            </button>

            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectCategory(id)}
                className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition ${
                  activeCategory === id
                    ? "border-[#143a30] bg-[#143a30] text-white"
                    : "border-black/10 bg-white text-[#25352b] hover:border-[#2b6558]"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY INTRO */}
      <section className="mx-auto max-w-7xl px-5 pb-2 pt-16 sm:px-8 sm:pt-20 lg:px-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#2b6558]">
              Inside our network
            </p>

            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#0b1d17] sm:text-4xl">
              Moments worth sharing.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#647168]">
              From leadership and community engagement to practical
              farming and training, discover the work happening
              across our agricultural network.
            </p>
          </div>

          <p className="shrink-0 text-sm font-medium text-[#647168]">
            Showing{" "}
            <span className="font-bold text-[#0b1d17]">
              {activeItems.length}
            </span>{" "}
            {activeItems.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      <div className="pb-20">
        {categories.map(({ id, label, icon: Icon }, index) => {
          const items = activeItems.filter(
            (item) => item.category === id
          );

          return (
            <section
              key={id}
              id={id}
              className={`scroll-mt-24 border-b border-black/[0.07] py-14 sm:py-16 ${
                index % 2 === 1 ? "bg-[#f4f7f1]" : "bg-white"
              }`}
            >
              <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#e8f0e7] text-[#2b6558]">
                      <Icon size={23} />
                    </div>

                    <div>
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8b922f]">
                        Collection {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="font-serif text-2xl font-semibold text-[#0b1d17] sm:text-3xl">
                        {label}
                      </h3>
                    </div>
                  </div>

                  <span className="hidden text-sm text-[#647168] sm:block">
                    {items.length}{" "}
                    {items.length === 1 ? "image" : "images"}
                  </span>
                </div>

                {items.length > 0 ? (
                  <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="group overflow-hidden border border-black/[0.07] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#2b6558]/30 hover:shadow-xl hover:shadow-[#0b1d17]/[0.07]"
                      >
                        <button
                          type="button"
                          onClick={() => openImage(item)}
                          className="relative block w-full overflow-hidden bg-[#e6ebe5] text-left"
                          aria-label={`View ${item.title}`}
                        >
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.alt}
                              loading="lazy"
                              onError={() => {
                                setImageErrors((previous) =>
                                  previous.includes(item.id)
                                    ? previous
                                    : [...previous, item.id]
                                );
                              }}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1d17]/0 transition duration-300 group-hover:bg-[#0b1d17]/40">
                            <span className="flex translate-y-2 items-center gap-2 bg-white px-4 py-2.5 text-sm font-bold text-[#0b1d17] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                              <Expand size={16} />
                              View image
                            </span>
                          </div>

                          <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2b6558]">
                            {label}
                          </span>
                        </button>

                        <div className="p-5 sm:p-6">
                          <h4 className="font-serif text-xl font-semibold text-[#0b1d17]">
                            {item.title}
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-[#647168]">
                            {item.description}
                          </p>

                          <div className="my-5 h-px bg-black/[0.08]" />

                          <dl className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                              <CalendarDays
                                size={16}
                                className="mt-0.5 shrink-0 text-[#8b922f]"
                              />
                              <div>
                                <dt className="text-xs text-[#849087]">
                                  Date
                                </dt>
                                <dd className="mt-0.5 font-medium text-[#25352b]">
                                  {item.date}
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Clock3
                                size={16}
                                className="mt-0.5 shrink-0 text-[#8b922f]"
                              />
                              <div>
                                <dt className="text-xs text-[#849087]">
                                  Time
                                </dt>
                                <dd className="mt-0.5 font-medium text-[#25352b]">
                                  {item.time}
                                </dd>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <MapPin
                                size={16}
                                className="mt-0.5 shrink-0 text-[#8b922f]"
                              />
                              <div>
                                <dt className="text-xs text-[#849087]">
                                  Venue
                                </dt>
                                <dd className="mt-0.5 leading-6 text-[#25352b]">
                                  {item.venue}
                                </dd>
                              </div>
                            </div>
                          </dl>

                          <button
                            type="button"
                            onClick={() => openImage(item)}
                            className="mt-6 inline-flex items-center gap-2 border-b border-[#2b6558]/40 pb-1 text-sm font-bold text-[#2b6558] transition hover:border-[#0b1d17] hover:text-[#0b1d17]"
                          >
                            View details
                            <ArrowUpRight size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-[#cbd6cc] bg-white/70 px-6 py-12 text-center">
                    <ImageIcon
                      size={30}
                      className="mx-auto text-[#91a398]"
                    />
                    <h4 className="mt-4 font-serif text-xl font-semibold text-[#0b1d17]">
                      More {label.toLowerCase()} moments are coming.
                    </h4>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#647168]">
                      There are no published images in this collection
                      yet. Check back as we document more of our work.
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* MEMBERSHIP CTA */}
      <section className="bg-[#0b1d17]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#a9d8b9]">
              Be part of the story
            </p>

            <h2 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Let’s grow agriculture together.
            </h2>

            <p className="mt-4 leading-7 text-white/65">
              Join farmers, cooperatives, young entrepreneurs and
              partners working to strengthen agriculture across Nigeria.
            </p>
          </div>

          <a
            href="/membership"
            className="inline-flex w-fit shrink-0 items-center gap-3 bg-[#d9b648] px-6 py-4 text-sm font-bold text-[#0b1d17] transition hover:bg-[#edd27a]"
          >
            Become a Member
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050d09]/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 text-white transition hover:bg-white/20 sm:right-7 sm:top-7"
            aria-label="Close image"
          >
            <X size={24} />
          </button>

          {activeItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage(-1);
                }}
                className="absolute left-2 top-1/3 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:top-1/2 sm:-translate-y-1/2"
                aria-label="Previous image"
              >
                <ChevronLeft size={26} />
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage(1);
                }}
                className="absolute right-2 top-1/3 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-1/2 sm:-translate-y-1/2"
                aria-label="Next image"
              >
                <ChevronRight size={26} />
              </button>
            </>
          )}

          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex max-h-[62vh] items-center justify-center bg-[#0b1d17]">
              <img
                src={selectedImage.image}
                alt={selectedImage.alt}
                className="max-h-[62vh] w-full object-contain"
              />
            </div>

            <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[1fr_0.8fr]">
              <div>
                <span className="inline-block bg-[#e8f0e7] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2b6558]">
                  {formatCategory(selectedImage.category)}
                </span>

                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#0b1d17] sm:text-3xl">
                  {selectedImage.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#647168]">
                  {selectedImage.description}
                </p>
              </div>

              <div className="space-y-4 border-t border-black/10 pt-5 text-sm md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <div>
                  <p className="text-xs text-[#849087]">Date</p>
                  <p className="mt-1 font-medium text-[#25352b]">
                    {selectedImage.date}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#849087]">Time</p>
                  <p className="mt-1 font-medium text-[#25352b]">
                    {selectedImage.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#849087]">Venue</p>
                  <p className="mt-1 leading-6 text-[#25352b]">
                    {selectedImage.venue}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    <Footer />
   </>

  );
}