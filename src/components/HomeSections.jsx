import { useState } from "react";
import {
  Sprout,
  Landmark,
  Smartphone,
  Coins,
  GraduationCap,
  FlaskConical,
  Truck,
  Globe,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
} from "react-icons/fa";



const pillars = [
  {
    number: "01",
    title: "Agribusiness",
    description:
      "Visibility, buyer connections and market access for farmers, cooperatives and agribusiness companies of every size.",
    Icon: Sprout,
  },
  {
    number: "02",
    title: "Agency Banking",
    description:
      "Savings, transactions and financing brought within reach of communities far from the nearest bank branch.",
    Icon: Landmark,
  },
  {
    number: "03",
    title: "Digital Tools",
    description:
      "Farm management apps, market information systems and secure connectivity built for rural realities.",
    Icon: Smartphone,
  },
];

const services = [
  {
    title: "Loans & Financing",
    description:
      "Affordable credit for land, equipment, inputs and seasonal working capital.",
    Icon: Coins,
  },
  {
    title: "Training & Advisory",
    description:
      "Hands-on guidance on modern techniques, post-harvest handling and value addition.",
    Icon: GraduationCap,
  },
  {
    title: "Crop Monitoring & Soil Testing",
    description:
      "Soil analysis and field monitoring so inputs go in at the right time, in the right place.",
    Icon: FlaskConical,
  },
  {
    title: "Export & Supply Chain",
    description:
      "Support preparing produce for export and reaching buyers beyond the local market.",
    Icon: Truck,
  },
];

const impactStats = [
  ["37", "States & FCT networked"],
  ["15", "Core services offered"],
  ["74", "Coordinators & leaders"],
  ["72", "Zonal leaders"],
  ["18", "Regional leaders"],
  ["111", "Senatorial leaders"],
  ["2,400", "Local Government leaders"],
  ["512", "State leaders across 12 states"],
  ["61", "Training sessions"],
  ["2", "Founding organisations"],
];

const testimonials = [
  {
    quote:
      "Since our state group formed, it takes one phone call to reach the coordinator instead of a whole day travelling.",
    author: "Cooperative member, Kano State",
  },
  {
    quote:
      "Agency banking through the hub means my cooperative no longer waits for market day to move money.",
    author: "Farmer group leader, Benue State",
  },
  {
    quote:
      "The soil testing service changed how we plan a season — less guesswork, better yield.",
    author: "Smallholder farmer, Oyo State",
  },
];

const partners = [
  {
    name: "Verneldos Global Services Ltd",
    image: "/images/p4.PNG",
    website: "https://verneldos.com.ng",
    facebook: "https://www.facebook.com/GLOBALFOODIMPACT",
  },
  {
    name: "Ntonarch Acumen Network",
    image: "/images/p1.png",
    website: "https://ntonarch.com",
    facebook: "https://web.facebook.com/profile.php?id=61573854690840",
  },
  {
    name: "Bank of Agriculture",
    image: "/images/p6.png",
  },
  {
    name: "Ministry of Social Welfare and Community Development, Cross River State",
    image: "/images/p7.png",
  },
  {
    name: "Federal Ministry of Agriculture and Rural Development",
    image: "/images/p10.png",
  },
  {
    name: "National Youth Assembly of Nigeria",
    image: "/images/p9.png",
  },
  {
    name: "National Youth Council of Nigeria",
    image: "/images/p8.png",
  },
  {
    name: "AAC Miracle Feeders Limited",
    image: "/images/p14.png",
  },
  {
    name: "MADIF",
    image: "/images/p13.png",
  },
  {
    name: "GOCITY GROUP",
    image: "/images/p5.svg",
    website: "https://gocitygroup.org",
  },
];


export default function HomeSections() {
  const [email, setEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  function handleNewsletterSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setNewsletterMessage("Please enter your email address.");
      return;
    }

    setNewsletterMessage(
      "Thanks for your interest! Newsletter subscription needs to be connected to a mailing service."
    );
  }

  return (
    <>
      <main>
        {/* PILLARS */}
        <section className="bg-[#F6F8F6] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {pillars.map(({ number, title, description, Icon }) => (
              <article
                key={number}
                className="group relative overflow-hidden rounded-2xl border border-[#E0E8E2] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C8EA80] hover:shadow-xl sm:p-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4E4] text-[#087443] transition group-hover:bg-[#0A3D33] group-hover:text-white">
                    <Icon size={27} />
                  </span>
                  <span className="font-serif text-4xl font-semibold text-[#DCE7DD]">
                    {number}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-semibold text-[#0A3D33]">
                  {title}
                </h2>

                <p className="mt-3 leading-7 text-[#5C6C62]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FEATURED SERVICES */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087443]">
                  What we do
                </p>
                <h2 className="max-w-2xl font-serif text-3xl font-semibold text-[#0A3D33] sm:text-4xl">
                  Where members put the network to work
                </h2>
              </div>

              <a
                href="/services"
                className="inline-flex w-fit items-center gap-2 font-semibold text-[#087443] transition hover:gap-3"
              >
                All 15 services <ArrowRight size={18} />
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-[#E4EAE5] bg-white p-6 transition hover:-translate-y-1 hover:border-[#A9CBA8] hover:shadow-lg sm:p-7"
                >
                  <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF4E4] text-[#087443]">
                    <Icon size={24} />
                  </span>

                  <h3 className="font-serif text-xl font-semibold leading-snug text-[#0A3D33]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#647268]">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT STATS */}
        <section className="bg-[#0A3D33] px-5 py-16 text-white sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#C8EA80]">
                Our reach
              </p>
              <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
                A growing network for agricultural development
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-5">
              {impactStats.map(([number, label]) => (
                <div
                  key={label}
                  className="min-h-32 bg-[#0A3D33] p-5 transition hover:bg-[#104C3F] sm:p-6"
                >
                  <p className="font-serif text-3xl font-semibold text-[#C8EA80] sm:text-4xl">
                    {number}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-[#F6F8F6] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087443]">
              Member experiences
            </p>

            <h2 className="font-serif text-3xl font-semibold text-[#0A3D33] sm:text-4xl">
              Voices from the network
            </h2>

            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {testimonials.map(({ quote, author }) => (
                <blockquote
                  key={author}
                  className="flex flex-col rounded-2xl border border-[#E0E8E2] bg-white p-7 sm:p-8"
                >
                  <span className="font-serif text-5xl leading-none text-[#87AD72]">
                    “
                  </span>
                  <p className="flex-1 leading-8 text-[#42564A]">{quote}</p>
                  <footer className="mt-6 border-t border-[#E6ECE7] pt-4 text-sm font-semibold text-[#0A3D33]">
                    {author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* OFFICIAL PARTNERS */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087443]">
                Working together
              </p>
              <h2 className="font-serif text-3xl font-semibold text-[#0A3D33] sm:text-4xl">
                Official partners
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((partner) => (
                <article
                  key={partner.name}
                  className="flex min-w-0 flex-col items-center justify-between rounded-2xl border border-[#E5EBE6] bg-white p-5 text-center transition hover:border-[#B8D5B4] hover:shadow-md sm:p-6"
                >
                  <div className="flex h-24 w-full items-center justify-center">
                    <img
                      src={partner.image}
                      alt={`${partner.name} logo`}
                      loading="lazy"
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold leading-6 text-[#243D2F]">
                    {partner.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-3">
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${partner.name} website`}
                        className="text-[#087443] transition hover:text-[#0A3D33]"
                      >
                        <Globe size={17} />
                      </a>
                    )}

                    {partner.facebook && (
                      <a
                        href={partner.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${partner.name} Facebook`}
                        className="text-[#087443] transition hover:text-[#0A3D33]"
                      >
                        <FaFacebookF size={16} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-[#EAF2E9] px-5 py-14 sm:px-8 lg:py-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#087443]">
                Stay informed
              </p>
              <h2 className="font-serif text-3xl font-semibold text-[#0A3D33] sm:text-4xl">
                Stay with the network
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-[#52685A]">
                Season updates, financing windows and training dates, straight
                to your inbox.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setNewsletterMessage("");
                  }}
                  placeholder="Enter your email address"
                  className="min-h-14 min-w-0 flex-1 rounded-xl border border-[#D4E0D5] bg-white px-4 text-sm text-[#243D2F] outline-none transition placeholder:text-[#89978D] focus:border-[#087443] focus:ring-2 focus:ring-[#087443]/15"
                />

                <button
                  type="submit"
                  className="min-h-14 rounded-xl bg-[#087443] px-7 font-semibold text-white transition hover:bg-[#0A3D33]"
                >
                  Subscribe
                </button>
              </div>

              {newsletterMessage && (
                <p role="status" className="mt-3 text-sm text-[#0A3D33]">
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

   
    </>
  );
}