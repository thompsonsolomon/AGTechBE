
import { useEffect, useState } from "react";
import {
  Coins,
  Laptop,
  Tractor,
  ChartNoAxesCombined,
  Megaphone,
  Building2,
  HandCoins,
  ChartPie,
  Sprout,
  TabletSmartphone,
  ShieldCheck,
  Wifi,
  Settings,
  Users,
  FlaskConical,
  Droplets,
  Leaf,
  GraduationCap,
  Warehouse,
  Truck,
  Globe,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const heroImages = ["/images/in2.png", "/images/in4.jpg"];

const categories = [
  {
    id: "market-finance",
    title: "Market & Finance",
    icon: Coins,
    description:
      "Helping farmers reach buyers, access financial services, and build profitable agricultural businesses.",
    services: [
      {
        title: "Agricultural Business Promotion",
        description:
          "We help farmers and agribusinesses gain visibility, connect with buyers, and access new markets, locally and beyond.",
        icon: Megaphone,
      },
      {
        title: "Agency Banking Services",
        description:
          "Essential financial services brought closer to rural communities, making it easier to save, transact and manage money without travelling far.",
        icon: Building2,
      },
      {
        title: "Loans & Financing",
        description:
          "We facilitate access to affordable credit and financing options to help farmers invest in land, equipment, inputs and growth.",
        icon: HandCoins,
      },
      {
        title: "Business Investment Consultancy",
        description:
          "We guide investors and farmers in making smart, profitable decisions, from business planning to crop and market selection.",
        icon: ChartPie,
      },
    ],
  },
  {
    id: "digital",
    title: "Digital Services",
    icon: Laptop,
    description:
      "Practical technology solutions that help modernise farm operations and connect rural communities.",
    services: [
      {
        title: "Agro Digital Services",
        description:
          "Technology support through digital tools, farm management platforms, data security design and rural connectivity solutions.",
        icon: Sprout,
      },
      {
        title: "Digital Tools & Online Platforms",
        description:
          "Access to market information systems, farm management apps and smart farming technologies that simplify day-to-day operations.",
        icon: TabletSmartphone,
      },
      {
        title: "Digital Security Design & Implementation",
        description:
          "We design and deploy robust digital security systems to protect farmers' data, financial transactions and agribusiness information.",
        icon: ShieldCheck,
      },
      {
        title: "Connectivity Solutions",
        description:
          "We facilitate reliable internet and network connectivity for farms and agribusinesses, keeping rural communities connected in real time.",
        icon: Wifi,
      },
    ],
  },
  {
    id: "field",
    title: "Field & Farm Support",
    icon: Tractor,
    description:
      "Supporting farmers with equipment, farm management, improved crops and more efficient production.",
    services: [
      {
        title: "Agricultural Machinery Facilitation",
        description:
          "We connect farmers with tractors, harvesters, irrigation systems and other modern equipment to reduce labour costs and increase productivity.",
        icon: Settings,
      },
      {
        title: "Farm Management & Workforce Solutions",
        description:
          "Professional support for planning operations, managing staff and running farms efficiently and profitably.",
        icon: Users,
      },
      {
        title: "Crop Monitoring & Soil Testing",
        description:
          "Soil analysis and crop monitoring services help farmers understand their land, prevent disease and apply the right inputs at the right time.",
        icon: FlaskConical,
      },
      {
        title: "Irrigation & Water Management",
        description:
          "We support the installation and management of irrigation systems to ensure year-round farming, even during dry seasons.",
        icon: Droplets,
      },
      {
        title: "Seedling Supply & Variety Advisory",
        description:
          "We provide improved seedlings and advise farmers on the best crop varieties for their soil type and climate.",
        icon: Leaf,
      },
    ],
  },
  {
    id: "growth",
    title: "Growth & Trade",
    icon: ChartNoAxesCombined,
    description:
      "Building agricultural knowledge, reducing waste and creating opportunities across local and international markets.",
    services: [
      {
        title: "Training, Value Addition & Advisory",
        description:
          "Practical training on modern farming techniques, post-harvest handling and how to add value to raw produce for higher earnings.",
        icon: GraduationCap,
      },
      {
        title: "Post-Harvest Management & Storage",
        description:
          "We help reduce post-harvest losses through proper storage techniques, processing guidance and access to storage facilities.",
        icon: Warehouse,
      },
      {
        title: "Export & Supply Chain Support",
        description:
          "We assist in preparing produce for export, navigating trade requirements and connecting with international buyers.",
        icon: Truck,
      },
      {
        title: "Climate-Smart & Sustainable Farming",
        description:
          "We promote environmentally responsible farming methods that protect natural resources and maintain long-term productivity.",
        icon: Globe,
      },
    ],
  },
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <article
      className="group border-t-2 border-[#1d4d42] pt-6 transition-all duration-300 hover:border-[#d9b648]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f2e9] text-[#1d4d42] transition duration-300 group-hover:bg-[#1d4d42] group-hover:text-white">
          <Icon size={23} strokeWidth={1.8} />
        </div>

        <span className="font-mono text-sm text-[#8a978d]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-[#143a30]">
        {service.title}
      </h3>

      <p className="max-w-xl text-sm leading-7 text-gray-600">
        {service.description}
      </p>
    </article>
  );
}

export default function ServicesSection() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const totalServices = categories.reduce(
    (total, category) => total + category.services.length,
    0
  );

  return (
    <main className="bg-white text-[#12140f]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0b1d17]">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${
              activeImage === index ? "opacity-35" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071710] via-[#0b1d17]/90 to-[#0b1d17]/45" />

        <div className="mx-auto grid min-h-[440px] max-w-7xl items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d9b648]" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#bfdcc9]">
                What we do
              </p>
            </div>

            <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Practical services.
              <span className="block text-[#d9b648]">
                Stronger agriculture.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">
              From financing and digital solutions to farm support, training
              and market access, Agro Trade Hub Africa connects farmers and
              agribusinesses with opportunities to grow.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="/membership"
                className="inline-flex items-center gap-3 bg-[#d9b648] px-6 py-4 text-sm font-bold text-[#0b1d17] transition hover:bg-white"
              >
                Become a Member
                <ArrowUpRight size={18} />
              </a>

              <Link
                to="#market-finance"
                className="inline-flex items-center gap-2 border border-white/30 px-6 py-4 text-sm font-semibold text-[#ffff] transition hover:border-[#d9b648] hover:text-[#d9b648]"
              >
               <span className="text-white">
                Explore our services
               </span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm border border-white/20 bg-black/20 p-8 backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#bfdcc9]">
                One connected platform
              </p>

              <p className="mt-5 font-serif text-5xl font-semibold text-white">
                {String(totalServices).padStart(2, "0")}
              </p>

              <p className="mt-2 text-lg font-medium text-white">
                Agricultural services
              </p>

              <div className="my-6 h-px bg-white/20" />

              <div className="space-y-4">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <a
                      key={category.id}
                      href={`#${category.id}`}
                      className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-[#d9b648]"
                    >
                      <Icon size={18} className="text-[#d9b648]" />
                      <span className="text-gray-200">
                      {category.title}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
          <div className="h-full w-1/3 bg-[#d9b648]" />
        </div>
      </section>

      {/* Sticky category navigation */}
      <nav
        aria-label="Jump to a service category"
        className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1d17] shadow-lg"
      >
        <div className="mx-auto flex max-w-7xl gap-7 overflow-x-auto px-6 py-4 sm:px-10 lg:px-12">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#cfe0d5] transition hover:text-[#d9b648]"
              >
                <Icon size={17} />
                <span className="text-[#cfe0d5]">
                {category.title}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Service categories */}
      {categories.map((category, categoryIndex) => {
        const Icon = category.icon;

        return (
          <section
            key={category.id}
            id={category.id}
            className={`scroll-mt-16 py-16 sm:py-20 ${
              categoryIndex % 2 === 1 ? "bg-[#f4f7f1]" : "bg-white"
            }`}
          >
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
              <div className="mb-10 grid gap-6 border-b border-[#12140f]/10 pb-8 md:grid-cols-[1fr_0.7fr] md:items-end">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center bg-[#e9f2e9] text-[#1d4d42]">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bb9222]">
                      Category {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl font-semibold text-[#143a30] sm:text-4xl">
                    {category.title}
                  </h2>
                </div>

                <p className="max-w-lg text-sm leading-7 text-gray-600 md:justify-self-end">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:gap-x-16 lg:gap-y-14">
                {category.services.map((service, index) => (
                  <ServiceCard
                    key={service.title}
                    service={service}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Membership CTA */}
      <section className="relative overflow-hidden bg-[#061A14]">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d9b648]">
              Let's grow together
            </p>

            <h2 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Ready to put these services to work?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#dcebe2] sm:text-base">
              Membership is open to farmers, cooperatives and agribusiness
              partners across every state network.
            </p>
          </div>

          <a
            href="/membership"
            className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#d9b648] px-7 py-4 font-semibold text-[#0b1d17] transition hover:bg-white"
          >
            <UserPlus size={19} />
            Become a Member
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
