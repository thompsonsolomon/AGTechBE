import { useEffect, useState } from "react";
import {
  Users,
  ClipboardCheck,
  Eye,
  Target,
  Heart,
  BookOpen,
  Sprout,
  X,
  ArrowRight,
  Globe,
  Handshake,
  ShieldCheck,
} from "lucide-react";

const leadership = [
  {
    tier: "Section 1",
    title: "National Executives",
    theme: "national",
    members: [
      {
        name: "Benard Chris",
        role: "National President",
        image: "e1.jpeg",
        socials: ["WhatsApp", "LinkedIn", "X"],
      },
      {
        name: "Bassey Nton Nton",
        role: "National Leader",
        image: "e2.jpg",
        socials: ["WhatsApp", "LinkedIn", "Facebook"],
      },
      {
        name: "Gideon Ebuka",
        role: "National Leader",
        image: "e4.jpg",
        socials: ["WhatsApp", "Instagram", "Twitter"],
      },
      {
        name: "Rosemary Usang Martina",
        role: "Head of Administration",
        image: "e6.jpeg",
        socials: ["WhatsApp", "Instagram", "Twitter"],
      },
      {
        name: "Joseph Itam",
        role: "CEO",
        image: "e5.jpeg",
        socials: ["WhatsApp", "Instagram", "Twitter"],
      },
      {
        name: "Nelly Ada",
        role: "Head of Finance",
        image: "e7.jpeg",
        socials: ["WhatsApp", "Instagram", "Twitter"],
      },
      {
        name: "Ada Edu Emmanuel",
        role: "Head of Agriculture",
        image: "e8.jpeg",
        socials: ["WhatsApp", "Instagram", "Twitter"],
      },
    ],
  },
  {
    tier: "Section 2",
    title: "State Leaders",
    theme: "state",
    members: [
      {
        name: "Luor Nathaniel Avlumun",
        role: "Benue State Coordinator",
        image: "e3.jpeg",
        socials: ["WhatsApp", "Facebook"],
      },
      {
        name: "Aliyu Martins",
        role: "Kaduna State Coordinator",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "Instagram"],
      },
      {
        name: "Bayo A. Wale",
        role: "Lagos State Coordinator",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "LinkedIn"],
      },
    ],
  },
  {
    tier: "Section 3",
    title: "Senatorial Executives",
    theme: "senatorial",
    members: [
      {
        name: "Mayowa Jams",
        role: "Ogun State South Coordinator",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "LinkedIn"],
      },
      {
        name: "Ibrahim T. Sule",
        role: "Taraba Central Coordinator",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "Instagram"],
      },
      {
        name: "Etim Okon",
        role: "Cross River State South Coordinator",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "X"],
      },
    ],
  },
  {
    tier: "Section 4",
    title: "Local Government Executives",
    theme: "local",
    members: [
      {
        name: "Mohammed Dansadau",
        role: "Tsafe LGA Coordinator, Zamfara State",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "Facebook"],
      },
      {
        name: "Kola J.",
        role: "Ido LGA Coordinator, Oyo State",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "Instagram"],
      },
      {
        name: "Ovieya Sini",
        role: "Ogbia LGA Coordinator, Bayelsa State",
        image: "Ath2.jpeg",
        socials: ["WhatsApp", "LinkedIn"],
      },
    ],
  },
];

const principles = [
  {
    title: "Vision",
    Icon: Eye,
    description:
      "A Nigeria where every farmer, regardless of location, has the same access to markets, finance and information as producers anywhere else in the country.",
  },
  {
    title: "Mission",
    Icon: Target,
    description:
      "To connect farmers, cooperatives and agribusinesses through state-level networks, and to open a direct line to Verneldos and Ntonarche services in every community.",
  },
  {
    title: "Core values",
    Icon: Heart,
    description:
      "Transparency, accountability, community-first coordination and lawful, well-governed operation across every partnership.",
  },
];

const historySections = [
  {
    title: "How It Began",
    paragraphs: [
      "It started on the ground. On March 18, 2016, a visit to Boki Local Government Area in Cross River State put us face to face with the realities of farming communities. Later, we took part in the Bakor Nation Festival on September 15 and travelled on to Benue State, listening to farmers and seeing first-hand where support was working and where it was falling short.",
      "What began as a single initiative has since grown into a Pan-African agricultural movement.",
    ],
  },
  {
    title: "Research and Discovery",
    paragraphs: [
      "Before building anything, Verneldos Global Services Ltd and Ntonarch Acumen Network, two independent companies, set out to understand the true state of agriculture on the ground. Together, they carried out assessments across Nigeria, conducted feasibility studies, and undertook extensive research into the challenges facing farmers, the gaps in existing support systems, and the opportunities across crop value chains.",
      "The findings led to one clear conclusion: Africa's agriculture needs a funnel — a structured channel that carries training, inputs, finance, and market access directly to practising farmers. Too much support was being lost along the way, and too little of it was reaching the people who actually work the land.",
    ],
  },
];

const partnerServices = [
  {
    title: "Capacity Building & Extension",
    description:
      "Practical training in modern, sustainable, high-yield farming practices.",
  },
  {
    title: "Farm Input Support",
    description:
      "Direct access to quality inputs that restore soil health and optimise harvest yields.",
  },
  {
    title: "Capital & Credit Access",
    description:
      "Facilitated financing to help farmers grow and sustain their operations.",
  },
];

const socialColors = {
  WhatsApp: "bg-emerald-100 text-emerald-800",
  LinkedIn: "bg-blue-100 text-blue-800",
  Facebook: "bg-blue-100 text-blue-800",
  Instagram: "bg-pink-100 text-pink-800",
  X: "bg-slate-200 text-slate-800",
  Twitter: "bg-sky-100 text-sky-800",
};

export default function AboutSections() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);

  const heroImages = ["/images/in3.jpg", "/images/in4.webp"];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!historyOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") setHistoryOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [historyOpen]);

  return (
    <main className="min-h-screen bg-[var(--white)] text-[var(--ink)]">
      {/* ABOUT HERO */}
      <section className="relative isolate overflow-hidden border-b border-[var(--line)] bg-[var(--forest)]">
        {heroImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 -z-20 h-full min-h-[540px] w-full object-cover transition-opacity duration-1000 ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071A13]/95 via-[#0B2C20]/85 to-[#0B2C20]/55" />

        <div className="mx-auto flex min-h-[540px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#BFE8C8] backdrop-blur-md sm:text-sm">
              <Sprout size={16} />
              About Agro Trade Hub Africa
            </div>

            <h1 className="max-w-4xl font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Two registered companies.{" "}
              <span className="text-[#BFE8C8]">
                One vision for agricultural growth.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-base leading-8 text-white/80 sm:text-sm">
              Agro Trade Hub Africa is a collaborative agricultural initiative
              formed by Verneldos Global Services Ltd and Ntonarche Acumen
              Network, two registered corporate entities united by a shared
              commitment to advancing agriculture in Nigeria. Through practical
              innovation, farmer-focused engagement, and stronger market access,
              the initiative is designed to support productivity, sustainability,
              and long-term growth across the agricultural value chain.
            </p>

            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#D9B648] px-6 py-3 font-semibold text-[#0B1D17] transition hover:bg-white"
            >
              Discover Our History
              <ArrowRight size={18} />
            </button>

            <div className="mt-9 flex items-center gap-2">
              {heroImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  aria-label={`Show hero image ${index + 1}`}
                  aria-pressed={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeSlide === index
                      ? "w-10 bg-[#D9B648]"
                      : "w-5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--paper)] text-[var(--leaf)]">
              <Users size={25} />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
              Our identity
            </p>

            <h2 className="mb-6 font-serif text-3xl font-semibold text-[var(--forest)] sm:text-4xl">
              Who we are
            </h2>

            <p className="mb-5 text-base leading-8 text-[var(--ink)]">
              Agro Trade Hub Africa was established through the coming together
              of two incorporated organisations: Verneldos Global Services Ltd
              and Ntonarche Acumen Network. Both companies are registered
              entities with a common purpose: to promote modern agricultural
              practices, strengthen rural productivity, and improve access to
              opportunities for farmers, cooperatives, and agribusiness
              stakeholders across Nigeria.
            </p>

            <p className="text-base leading-8 text-[var(--ink)]">
              Together, the two organisations created Agro Trade Hub Africa as
              a unified platform for agricultural development. By combining
              institutional strength, grassroots reach, and a shared commitment
              to practical impact, they are helping to build a more efficient,
              resilient, and commercially viable farming ecosystem across the
              country.
            </p>
          </div>

          <aside className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--forest)] text-white">
                <ClipboardCheck size={23} />
              </span>
              <h3 className="font-serif text-xl font-semibold text-[var(--forest)]">
                At a glance
              </h3>
            </div>

            <dl className="space-y-6">
              <div className="border-b border-[var(--line)] pb-5">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                  Founding entities
                </dt>
                <dd className="leading-7 text-[var(--ink)]">
                  Verneldos Global Services Ltd & Ntonarche Acumen Network
                </dd>
              </div>

              <div className="border-b border-[var(--line)] pb-5">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                  Initiative
                </dt>
                <dd className="font-semibold text-[var(--forest)]">
                  Agro Trade Hub Africa
                </dd>
              </div>

              <div className="border-b border-[var(--line)] pb-5">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                  Mission
                </dt>
                <dd className="leading-7 text-[var(--ink)]">
                  To promote modern farming practices and improve farmer access
                  to markets, services, and opportunities.
                </dd>
              </div>

              <div>
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--leaf)]">
                  Reach
                </dt>
                <dd className="flex items-center gap-2 font-semibold text-[var(--forest)]">
                  <Globe size={18} className="shrink-0 text-[var(--leaf)]" />
                  36 states and the FCT coordinator network
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* VISION, MISSION AND VALUES */}
      <section className="bg-[var(--forest)] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--sprout)]">
              What guides us
            </p>
            <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              The principles behind our work
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {principles.map(({ title, description, Icon }, index) => (
              <article
                key={title}
                className="border-t-2 border-[var(--sprout)] pt-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[var(--sprout)]">
                    <Icon size={25} />
                  </span>
                  <span className="font-serif text-4xl font-semibold text-white/15">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mb-4 font-serif text-2xl font-semibold text-white">
                  {title}
                </h3>

                <p className="leading-8 text-white/75">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="bg-[var(--paper)] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
              The people behind the work
            </p>

            <h2 className="font-serif text-3xl font-semibold text-[var(--forest)] sm:text-5xl">
              Leadership structure
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-[var(--ink)]">
              Our leadership structure brings together national executives,
              state coordinators, senatorial representatives and local
              government leaders to support coordination across the network.
            </p>
          </div>

          <div className="space-y-8">
            {leadership.map((tier) => (
              <section
                key={tier.title}
                className={`overflow-hidden rounded-2xl border p-5 sm:p-7 lg:p-8 ${
                  tier.theme === "national"
                    ? "border-emerald-900 bg-gradient-to-br from-[#0B2E21] to-[#16442F]"
                    : tier.theme === "state"
                      ? "border-emerald-900/10 bg-[#EAF3E8]"
                      : tier.theme === "senatorial"
                        ? "border-blue-900/10 bg-[#EDF2FA]"
                        : "border-rose-900/10 bg-[#F7EDF1]"
                }`}
              >
                <div className="mb-7 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      tier.theme === "national"
                        ? "border border-white/20 bg-white/10 text-emerald-100"
                        : tier.theme === "state"
                          ? "bg-emerald-100 text-emerald-900"
                          : tier.theme === "senatorial"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-rose-100 text-rose-900"
                    }`}
                  >
                    {tier.tier}
                  </span>

                  <h3
                    className={`font-serif text-2xl font-semibold ${
                      tier.theme === "national"
                        ? "text-white"
                        : "text-[#18382A]"
                    }`}
                  >
                    {tier.title}
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {tier.members.map((member) => (
                    <article
                      key={member.name}
                      className={`flex min-w-0 items-center gap-4 rounded-xl border p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                        tier.theme === "national"
                          ? "border-white/10 bg-white/[0.06]"
                          : "border-black/[0.06] bg-white"
                      }`}
                    >
                      <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-full border-2 border-white/60 bg-[var(--paper)] shadow-sm">
                        <img
                          src={`/images/${member.image}`}
                          alt={member.name}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`break-words font-semibold leading-snug ${
                            tier.theme === "national"
                              ? "text-white"
                              : "text-[#18382A]"
                          }`}
                        >
                          {member.name}
                        </h4>

                        <p
                          className={`mt-1 text-sm leading-6 ${
                            tier.theme === "national"
                              ? "text-emerald-100/80"
                              : "text-slate-600"
                          }`}
                        >
                          {member.role}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {member.socials.map((social) => (
                            <span
                              key={social}
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                tier.theme === "national"
                                  ? "bg-white/10 text-emerald-50"
                                  : socialColors[social] ||
                                    "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {social}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          <article>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--paper)] text-[var(--leaf)]">
              <BookOpen size={25} />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
              Where we started
            </p>

            <h2 className="mb-6 font-serif text-3xl font-semibold text-[var(--forest)] sm:text-4xl">
              Our story
            </h2>

            <p className="mb-5 leading-8 text-[var(--ink)]">
              Agro Trade Hub Africa began as a response to a simple gap:
              farmers across Nigeria needed a consistent, trustworthy way to
              reach financial services, buyers and modern farming knowledge —
              without depending on whichever contact happened to be nearby.
            </p>

            <p className="leading-8 text-[var(--ink)]">
              By organising coordinators and secretaries in every state, and
              linking that network directly to Verneldos and Ntonarche's
              service lines, the initiative turned a scattered set of
              relationships into one coordinated platform that any member can
              call on.
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--forest)] text-white">
              <Sprout size={25} />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--leaf)]">
              Our purpose
            </p>

            <h2 className="mb-6 font-serif text-3xl font-semibold text-[var(--forest)]">
              Why Agro Trade Hub Africa?
            </h2>

            <p className="mb-5 leading-8 text-[var(--ink)]">
              Cooperative societies, financial institutions and commercial
              partners — including FIS Community Hope MPCS — already work
              alongside the network to strengthen market access, secure supply
              chains and improve inclusive participation for smallholders and
              larger agribusinesses alike.
            </p>

            <div className="mt-7 flex items-start gap-3 border-t border-[var(--line)] pt-6">
              <Handshake
                size={23}
                className="mt-1 shrink-0 text-[var(--leaf)]"
              />
              <div>
                <h3 className="font-semibold text-[var(--forest)]">
                  Growing through collaboration
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--ink)]">
                  We believe meaningful agricultural progress comes from
                  connecting people, services, knowledge and opportunity.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[var(--forest)] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--sprout)]">
              <ShieldCheck size={19} />
              Be part of the network
            </div>

            <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              Help build a stronger future for agriculture.
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              Join farmers, cooperatives and agribusiness stakeholders working
              towards a more connected agricultural ecosystem.
            </p>
          </div>

          <a
            href="/membership"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-lg bg-[#D9B648] px-6 py-3 font-semibold text-[#0B1D17] transition hover:bg-white"
          >
            Explore Membership
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* HISTORY MODAL */}
      {historyOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setHistoryOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--white)] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-5 border-b border-[var(--line)] bg-[var(--paper)] px-5 py-5 sm:px-8 sm:py-6">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--leaf)]">
                  The story behind the initiative
                </p>
                <h2
                  id="history-title"
                  className="font-serif text-3xl font-semibold text-[var(--forest)]"
                >
                  Our History
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                aria-label="Close history"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--forest)] transition hover:bg-[var(--line)]"
              >
                <X size={21} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <p className="leading-8 text-[var(--ink)]">
                <strong>
                  Welcome to the official platform of Agro Trade Hub Africa.
                </strong>
              </p>

              {historySections.map((section) => (
                <article key={section.title} className="mt-7">
                  <h3 className="mb-3 font-serif text-xl font-semibold text-[var(--forest)]">
                    {section.title}
                  </h3>

                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mb-4 leading-8 text-[var(--ink)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </article>
              ))}

              <article className="mt-7">
                <h3 className="mb-3 font-serif text-xl font-semibold text-[var(--forest)]">
                  Our Mission
                </h3>

                <p className="leading-8 text-[var(--ink)]">
                  To empower practising farmers across diverse crop value chains
                  through a modern, structured, end-to-end support model.
                </p>

                <p className="mt-4 leading-8 text-[var(--ink)]">
                  Today, in strategic partnership with other key sector
                  stakeholders, Verneldos Global Services Ltd and Ntonarch
                  Acumen Network proudly present{" "}
                  <strong>Agro Trade Hub Africa.</strong>
                </p>
              </article>

              <article className="mt-7">
                <h3 className="mb-4 font-serif text-xl font-semibold text-[var(--forest)]">
                  What We Offer
                </h3>

                <p className="mb-4 leading-8 text-[var(--ink)]">
                  Our services are open to registered members and beyond.
                </p>

                <div className="space-y-4">
                  {partnerServices.map((service) => (
                    <div
                      key={service.title}
                      className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-4"
                    >
                      <h4 className="font-semibold text-[var(--forest)]">
                        {service.title}
                      </h4>
                      <p className="mt-1 text-sm leading-7 text-[var(--ink)]">
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="mt-7">
                <h3 className="mb-3 font-serif text-xl font-semibold text-[var(--forest)]">
                  Join the Movement
                </h3>

                <p className="leading-8 text-[var(--ink)]">
                  Agro Trade Hub Africa welcomes more partners to join the
                  Pan-African agricultural movement. Together, we are building
                  a stronger future for African farmers.
                </p>
              </article>

              <a
                href="/membership"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--gold)] px-6 py-3 font-semibold text-[#0B1D17] no-underline transition hover:opacity-80"
              >
                Join Membership
                <ArrowRight size={18} />
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}