
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  MapPinned,
  Wheat,
  Store,
  Scale,
  Sprout,
  Leaf,
  ShoppingBasket,
  Link2,
  Truck,
  Building2,
  TrendingUp,
  Handshake,
  ChevronRight,
} from "lucide-react";

const heroImages = ["/images/in5.webp", "/images/in6.png"];

const regions = [
  {
    name: "North Central",
    states: [
      ["Benue", "Yam, cassava, rice, sorghum, soybean and beniseed; strong aggregation markets in Makurdi, Otukpo and Gboko."],
      ["Kogi", "Cassava, yam, rice, maize, cashew and oil palm; Lokoja, Kabba and Okene are key trading hubs."],
      ["Kwara", "Maize, cassava, yam, rice, sorghum, tomatoes and poultry; Ilorin, Offa and Patigi are active commercial markets."],
      ["Nasarawa", "Yam, cassava, rice, maize, sesame and ginger; Lafia, Keffi and Akwanga are important trade points."],
      ["Niger", "Rice, maize, sorghum, yam, cassava, shea, ginger and livestock; major hubs in Minna, Bida and Suleja."],
      ["Plateau", "Irish potato, tomatoes, cabbage, carrots, maize and dairy; Jos and Bokkos lead in potato and vegetable trade."],
      ["FCT, Abuja", "Yam, cassava, maize, sorghum, millet, vegetables and peri-urban poultry and piggery."],
    ],
  },
  {
    name: "North East",
    states: [
      ["Adamawa", "Maize, rice, cotton, groundnut, ginger and cattle; Mubi and Yola are major market points."],
      ["Bauchi", "Sorghum, millet, cowpea, groundnut, cotton, maize and large cattle and goat populations."],
      ["Borno", "Millet, sorghum, cowpea, groundnut, gum arabic, fishing and irrigated wheat; Maiduguri and Baga are key trading centres."],
      ["Gombe", "Maize, sorghum, groundnut, cowpea, cotton and tomatoes; markets in Gombe and Dukku."],
      ["Taraba", "Maize, rice, sorghum, yam, cassava, ginger and tea; Jalingo, Wukari and Bali are important nodes."],
      ["Yobe", "Gum arabic, millet, sorghum, cowpea, groundnut, sesame and livestock; Potiskum is a major livestock hub."],
    ],
  },
  {
    name: "North West",
    states: [
      ["Jigawa", "Rice, wheat, sorghum, sesame, millet and onions; irrigation and wetland farming drive output."],
      ["Kaduna", "Maize, sorghum, ginger, cotton, soybean and tomatoes; Kaduna, Zaria and Kachia are strategic markets."],
      ["Kano", "Millet, sorghum, groundnut, cowpea, onion, tomatoes, wheat and rice; Dawanau is a major grain market."],
      ["Katsina", "Millet, sorghum, maize, cowpea, groundnut, cotton and sesame; Funtua is an important grain market."],
      ["Kebbi", "Rice, maize, sorghum, millet, wheat and onions; Birnin Kebbi and Argungu are key rice and fishing hubs."],
      ["Sokoto", "Millet, sorghum, rice, cowpea, onions, cotton and goats; Sokoto central and Illela are important trade routes."],
      ["Zamfara", "Millet, sorghum, groundnut, cowpea, rice and livestock; Gusau and Kaura Namoda are major trade centres."],
    ],
  },
  {
    name: "South West",
    states: [
      ["Ekiti", "Cocoa, cassava, yam, oil palm, kolanut, citrus and plantain; strong market links via Ado-Ekiti and Ikere."],
      ["Lagos", "Poultry, fisheries, aquaculture, vegetables and food processing; Mile 12 and Epe remain key perishables hubs."],
      ["Ogun", "Cassava, maize, cocoa, kolanut, oil palm, rubber and poultry; Abeokuta, Ijebu-Ode and Sagamu are major trade routes."],
      ["Ondo", "Cocoa, oil palm, cassava, yam, rubber, citrus and fishing; Akure, Ondo town and Ore are support centres."],
      ["Osun", "Cocoa, cassava, yam, maize and oil palm; Oshogbo and Ilesa are trading hubs."],
      ["Oyo", "Maize, cassava, yam, cocoa, cashew, plantain and large poultry and cattle sectors; Bodija and Ogbomoso are key market anchors."],
    ],
  },
  {
    name: "South East",
    states: [
      ["Abia", "Cassava, yam, oil palm, maize, fruits, rubber and poultry; Aba and Umuahia are strong food commerce centres."],
      ["Anambra", "Cassava, yam, rice, maize, oil palm and vegetables; Onitsha remains a major trade hub."],
      ["Ebonyi", "Rice, yam, cassava, maize and cocoyam; Abakaliki is known for rice production and milling."],
      ["Enugu", "Cassava, yam, rice, maize, cocoyam, oil palm and poultry; Ogbete and Nsukka are notable trade points."],
      ["Imo", "Cassava, yam, oil palm, maize, cocoyam, citrus and poultry; Eke Ukwu and Relief Market are important markets."],
    ],
  },
  {
    name: "South South",
    states: [
      ["Akwa Ibom", "Oil palm, cassava, plantain, fishing and aquaculture; Uyo and Eket are important trade centres."],
      ["Bayelsa", "Fishing, aquaculture, cassava, plantain, coconut and oil palm; Yenagoa and Brass are key fish and agro hubs."],
      ["Cross River", "Cocoa, oil palm, rubber, cassava, yam and timber; Calabar and Ikom anchor trade and value chains."],
      ["Delta", "Cassava, oil palm, rubber, yam, plantain and aquaculture; Warri, Asaba and Sapele are major nodes."],
      ["Edo", "Rubber, oil palm, cassava, yam, cocoa, timber and pineapple; Benin City is a major market and logistics centre."],
      ["Rivers", "Fishing, aquaculture, cassava, oil palm, yam and swamp rice; Port Harcourt and Bonny are key logistics and fish hubs."],
    ],
  },
];

const snapshots = [
  {
    label: "Primary production clusters",
    title: "North Central & North West",
    description:
      "Grains, root crops, cereals and livestock remain central to national output, with Benue, Kebbi, Kano and Kaduna standing out.",
    icon: Wheat,
  },
  {
    label: "Major constraints",
    title: "Insecurity, roads & storage",
    description:
      "Insecurity, poor rural transport, flooding and post-harvest losses continue to weaken production and market efficiency.",
    icon: Truck,
  },
  {
    label: "Top commodity zones",
    title: "Cocoa, rice, yam & fisheries",
    description:
      "Ondo and Cross River anchor cocoa; Kebbi and Ebonyi are known for rice; Benue and Taraba are strong in yam and cassava.",
    icon: Sprout,
  },
  {
    label: "Key trading hubs",
    title: "Jos, Kano, Lagos & Port Harcourt",
    description:
      "From Dawanau to Mile 12 and Port Harcourt, urban markets remain important channels for food aggregation and trade.",
    icon: Store,
  },
];

const programs = [
  {
    id: "markets",
    number: "01",
    eyebrow: "PRODUCE & MARKET ACCESS",
    title: "Promote agricultural products and market access",
    description:
      "Help producers find buyers, strengthen supply chains and create new opportunities for agricultural products.",
    icon: Store,
    initiatives: [
      ["State Produce Showcase", "A recurring exhibition and trade fair rotating across states, where farmers and cooperatives present crops, livestock and processed goods to buyers, retailers and exporters."],
      ["Agro Trade Hub Africa Marketplace Days", "Scheduled market-linkage events connecting producers directly with bulk buyers, food processors, schools, hospitals, hotels and other institutional purchasers."],
      ["“Made by Our Farmers” Branding Initiative", "A shared label for produce sold through the Hub's network, helping build buyer trust and recognition for participating farmers."],
      ["Digital Produce Catalogue", "A seasonal online listing where cooperatives share available produce so buyers across Nigeria can discover and place orders."],
      ["Cross-State Value Chain Tours", "Site visits that connect producers in one state with processors and exporters in another, helping develop multi-state supply relationships."],
      ["Export Readiness Program", "Support for larger cooperatives to meet the packaging, quality and documentation standards required for regional and international markets."],
      ["Agro Trade Hub Africa Trade Missions", "Organized delegations of farmers and cooperative leaders to trade fairs and buyer events beyond their home state, opening new market relationships."],
    ],
  },
  {
    id: "advocacy",
    number: "02",
    eyebrow: "FARMER VOICE & POLICY",
    title: "Advocate for better agricultural policies",
    description:
      "Create a stronger farmer voice through dialogue, evidence, collaboration and constructive engagement with decision-makers.",
    icon: Scale,
    initiatives: [
      ["Farmer Policy Dialogues", "Town-hall meetings where farmers raise concerns such as land access, input costs and transport, informing position papers for state and federal ministries."],
      ["Agro Trade Hub Africa Policy Brief Series", "Regular, concise publications translating farmers' concerns into practical recommendations for legislators, ministries and the press."],
      ["State-Level Farmer Advocacy Councils", "Representative groups in state networks that liaise with local government on fertilizer access, storage infrastructure, rural roads and related priorities."],
      ["Coalition Building with Cooperatives Associations", "Joint advocacy with farmer unions and cooperative federations to amplify a unified voice on agricultural policy."],
      ["Annual State of Agriculture Report", "A yearly publication bringing together state-network data and farmer testimony to track policy progress and promote institutional accountability."],
      ["Media and Press Engagement Program", "Relationships with agricultural journalists and local media that keep farmer priorities visible in public discussion."],
    ],
  },
  {
    id: "youth",
    number: "03",
    eyebrow: "YOUNG FARMERS & ENTERPRISE",
    title: "Bring more young people into farming",
    description:
      "Make agriculture a practical, modern and rewarding career through mentorship, enterprise development and digital skills.",
    icon: Sprout,
    initiatives: [
      ["Young Farmers Fellowship", "A structured entry into farming that pairs interested young people with experienced farmers for mentorship in production and farm business."],
      ["Agri-Business Bootcamps for Youth", "Practical short courses on launching a farm enterprise, accessing finance and connecting to the Hub's market network."],
      ["School and Campus Outreach", "Talks and demonstration visits at secondary schools and universities presenting farming as a modern, viable business path."],
      ["Youth Farm Starter Grants and Micro-loans", "Work with Verneldos and Ntonarche to develop small-scale finance or input-support packages for first-time young farmers."],
      ["Agri-Tech Youth Challenge", "A competition inviting young people to apply technology, practical tools and social media marketing to farming operations across the Hub network."],
      ["Young Farmer Ambassadors", "Fellowship graduates serve as peer mentors and local recruiters, sharing farming opportunities through their own communities."],
      ["Land Access Support for Youth", "Work with local authorities and community leaders to help young people without inherited land find affordable land to farm."],
    ],
  },
  {
    id: "soil",
    number: "04",
    eyebrow: "ORGANIC INPUTS & SOIL",
    title: "Build awareness of organic fertilizers",
    description:
      "Promote soil health, responsible input use and practical approaches that support long-term agricultural productivity.",
    icon: Leaf,
    initiatives: [
      ["Organic Fertilizer Demonstration Plots", "Side-by-side farm plots demonstrate the effects of organic and synthetic inputs on yields and soil health."],
      ["Community Fertilizer Workshops", "Hands-on learning in making and applying compost and organic fertilizer locally, helping reduce reliance on costly imported inputs."],
      ["“Soil Health First” Campaign", "Radio, community meetings and printed materials share the long-term benefits of organic fertilizer for soil and produce quality."],
      ["Organic Input Cooperative Buying", "Help farmer groups pool resources to buy or produce organic fertilizer at a lower cost."],
      ["Organic Fertilizer Production Training", "Training for interested cooperatives to produce organic fertilizer at small commercial scale, creating income while supplying local farmers."],
      ["Soil Testing Days", "Community events offering basic soil testing so farmers can understand their land's needs and make informed input choices."],
    ],
  },
  {
    id: "local-food",
    number: "05",
    eyebrow: "LOCAL FOOD & CONSUMER DEMAND",
    title: "Encourage people to buy local and eat local",
    description:
      "Strengthen demand for Nigerian-grown food by connecting producers, households, retailers and institutional kitchens.",
    icon: ShoppingBasket,
    initiatives: [
      ["“Eat Nigerian, Grow Nigerian” Campaign", "Public messaging encouraging households, restaurants and institutions to choose locally grown produce."],
      ["Local Produce Partnerships with Schools and Hospitals", "Build relationships with institutional kitchens to source food directly from farmers in the Hub network."],
      ["Farmers' Markets in Urban Centers", "Regular city markets bring local produce directly to urban consumers and shorten the supply chain."],
      ["Consumer Awareness Drives", "Share accessible information on the nutritional and economic benefits of buying domestically grown food."],
      ["Restaurant and Hospitality Sourcing Partnerships", "Direct supply agreements with restaurants and hotels interested in offering locally sourced menus."],
      ["Local Produce Cooking and Recipe Campaigns", "Community and social content featuring ways to prepare popular local staples and build everyday demand."],
    ],
  },
  {
    id: "digital-ag",
    number: "06",
    eyebrow: "BLOCKCHAIN & DIGITAL AGRICULTURE",
    title: "Build blockchain awareness and promote agricultural investment",
    description:
      "Explore how digital literacy, traceability and emerging technology can support more transparent agricultural value chains.",
    icon: Link2,
    initiatives: [
      ["Blockchain Farming Awareness Workshops", "Community sessions explain how digital ledgers can support traceable supply chains, transparent payments and verifiable produce records."],
      ["Digital Traceability Pilot", "A small cooperative pilot records harvest, transport and sale data so buyers can verify produce origin and quality."],
      ["“Farm Ledger” Demonstration", "Hands-on demonstrations of digital record-keeping for proof of land use and sale, and support in resolving disputes."],
      ["Blockchain Investment Roundtables", "Bring together agri-tech investors, fintech firms and development partners to explore funding useful digital tools for Nigerian farmers."],
      ["Youth Digital Farming Track", "Pair the Young Farmers Fellowship with introductory blockchain and digital-skills training, positioning youth as digital agriculture leaders."],
      ["Partnership Scouting with African Agri-Tech Platforms", "Identify existing African blockchain agriculture initiatives and explore pilot partnerships and knowledge exchange."],
      ["Farmer Digital Readiness Assessment", "Survey phone and internet access and digital literacy across state networks before introducing tools that depend on digital access."],
      ["Digital Cooperative Wallets Pilot", "Test simple blockchain-based payment wallets with one or two cooperatives so members can receive transparent payments directly."],
      ["Blockchain Literacy Champions", "Train farmers in each state network to explain digital tools and provide practical support within their communities."],
    ],
  },
];

const quickFacts = [
  {
    icon: Building2,
    title: "Farmer-led insight",
    text: "Grounded in the realities of agricultural communities.",
  },
  {
    icon: Handshake,
    title: "Stronger connections",
    text: "Bringing producers, buyers and partners closer together.",
  },
  {
    icon: TrendingUp,
    title: "Long-term growth",
    text: "Supporting better opportunities across the value chain.",
  },
];

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-10 grid gap-5 border-b border-[#12140f]/10 pb-8 md:grid-cols-[1fr_0.75fr] md:items-end">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#99751a]">
          {eyebrow}
        </p>
        <h2 className="flex items-start gap-3 font-serif text-3xl font-semibold leading-tight text-[#143a30] sm:text-4xl">
          {Icon && (
            <Icon
              size={29}
              strokeWidth={1.7}
              className="mt-1 shrink-0 text-[#2b6558]"
            />
          )}
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-xl text-sm leading-7 text-gray-600 md:justify-self-end">
          {description}
        </p>
      )}
    </div>
  );
}

function InitiativeCard({ initiative, index }) {
  return (
    <article className="group border-t border-[#12140f]/15 pt-5 transition-colors duration-300 hover:border-[#bb9222]">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center bg-[#edf3e9] text-xs font-bold text-[#1d4d42] transition-colors group-hover:bg-[#1d4d42] group-hover:text-white">
          {String(index + 1).padStart(2, "0")}
        </span>
        <ArrowUpRight
          size={17}
          className="text-[#9ba59d] transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#99751a]"
        />
      </div>

      <h3 className="mb-3 text-base font-bold leading-snug text-[#143a30]">
        {initiative[0]}
      </h3>
      <p className="text-sm leading-7 text-gray-600">{initiative[1]}</p>
    </article>
  );
}

function RegionCard({ region, index }) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#143a30]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3 bg-[#143a30] px-5 py-4">
        <h3 className="font-serif text-xl font-semibold text-white">
          {region.name}
        </h3>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-[#d9b648]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="divide-y divide-[#12140f]/10 px-5">
        {region.states.map(([name, description]) => (
          <div key={name} className="py-4">
            <h4 className="mb-1 text-sm font-bold text-[#1d4d42]">{name}</h4>
            <p className="text-sm leading-6 text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function ProgramsSection() {
  const [activeImage, setActiveImage] = useState(0);
  const totalInitiatives = programs.reduce(
    (total, program) => total + program.initiatives.length,
    0
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="overflow-hidden bg-white text-[#12140f]">
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

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071710] via-[#0b1d17]/90 to-[#0b1d17]/50" />

        <div className="mx-auto grid min-h-[470px] max-w-7xl items-center gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d9b648]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bfdcc9] sm:text-sm">
                Programs for lasting agricultural growth
              </p>
            </div>

            <h1 className="max-w-3xl font-serif text-2xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Connecting farmers to opportunity
              <span className="block text-[#d9b648]">
                at every stage.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-sm">
              Agro Trade Hub Africa brings farmers, cooperatives, young people,
              buyers and public institutions together through practical
              programs that strengthen the whole agricultural value chain.
            </p>

            <a
              href="#program-areas"
              className="mt-8 inline-flex items-center gap-3 bg-[#d9b648] px-6 py-4 text-sm font-bold text-[#0b1d17] transition hover:bg-white"
            >
              Explore our programs
              <ArrowDown size={18} />
            </a>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6">
              <div>
                <p className="font-serif text-3xl font-semibold text-white">
                  06
                </p>
                <p className="mt-1 text-xs text-gray-300">Focus areas</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="font-serif text-3xl font-semibold text-white">
                  {totalInitiatives}
                </p>
                <p className="mt-1 text-xs text-gray-300">Initiatives outlined</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="font-serif text-3xl font-semibold text-white">
                  36 + FCT
                </p>
                <p className="mt-1 text-xs text-gray-300">States and territory</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm border border-white/20 bg-[#0b1d17]/70 p-7 backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9b648]">
                Our program framework
              </p>

              <h2 className="mt-4 font-serif text-2xl font-semibold leading-snug text-white">
                Building stronger agricultural communities.
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-300">
                From farm-level knowledge to national market access, explore
                the focus areas shaping our agricultural development agenda.
              </p>

              <div className="mt-6 space-y-1">
                {programs.map((program) => {
                  const Icon = program.icon;

                  return (
                    <a
                      key={program.id}
                      href={`#${program.id}`}
                      className="flex items-center gap-3 border-t border-white/10 py-3 text-sm text-gray-200 transition hover:text-[#d9b648]"
                    >
                      <Icon size={17} className="shrink-0 text-[#d9b648]" />
                      <span className="flex-1">{program.title}</span>
                      <ChevronRight size={15} />
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

      {/* National agriculture snapshot */}
      <section
        id="landscape"
        className="scroll-mt-24 bg-[#f4f7f1] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <SectionHeading
            eyebrow="00 / National agriculture snapshot"
            title="Nigeria's agricultural landscape"
            description="Nigeria's agricultural strengths are spread across six geopolitical zones, each shaped by climate, land resources, market access and local infrastructure. This snapshot highlights important production corridors and opportunities across the country."
            icon={MapPinned}
          />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {snapshots.map((snapshot, index) => {
              const Icon = snapshot.icon;

              return (
                <article
                  key={snapshot.label}
                  className="group rounded-xl border border-[#143a30]/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf3e9] text-[#1d4d42]">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs text-gray-400">
                      0{index + 1}
                    </span>
                  </div>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#99751a]">
                    {snapshot.label}
                  </p>

                  <h3 className="mb-3 font-serif text-xl font-semibold leading-snug text-[#143a30]">
                    {snapshot.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-600">
                    {snapshot.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mb-8 mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.17em] text-[#99751a]">
                Explore by region
              </p>
              <h3 className="font-serif text-3xl font-semibold text-[#143a30]">
                Agricultural activity across Nigeria
              </h3>
            </div>
            <p className="max-w-lg text-sm leading-7 text-gray-600">
              Explore the major crops, livestock activities and trading
              locations associated with each zone.
            </p>
          </div>

          <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
            {regions.map((region, index) => (
              <RegionCard key={region.name} region={region} index={index} />
            ))}
          </div>

          <div className="mt-8 border-l-4 border-[#d9b648] bg-[#f7efc8]/60 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <MapPinned
                size={21}
                className="mt-1 shrink-0 text-[#99751a]"
              />
              <div>
                <h3 className="mb-2 font-semibold text-[#143a30]">
                  National agriculture: key pointers
                </h3>
                <p className="text-sm leading-7 text-gray-700">
                  Niger and Borno are among Nigeria's largest states by land
                  area, while Lagos, Anambra, Ebonyi and Imo are among the
                  smallest. Ondo, Ekiti, Osun, Cross River and Ogun are
                  associated with cocoa production. Kebbi, Ebonyi, Niger, Kano
                  and Benue are important rice-producing states. Livestock
                  production is significant in Sokoto, Kebbi, Borno, Yobe and
                  Bauchi, while fisheries are important in Bayelsa, Rivers,
                  Delta, Akwa Ibom and Lagos.
                </p>
                <p className="mb-0 mt-3 text-xs leading-6 text-gray-500">
                  This is a high-level orientation, not a current statistical
                  ranking. Crop output, production rankings and market
                  conditions can vary by season and source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky program navigation */}
      <nav
        aria-label="Jump to a program area"
        className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1d17] shadow-lg"
      >
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-4 sm:px-10 lg:px-12">
          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <a
                key={program.id}
                href={`#${program.id}`}
                className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#cfe0d5] transition hover:text-[#d9b648]"
              >
                <Icon size={17} />
                {program.eyebrow
                  .split(" & ")[0]
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </a>
            );
          })}
        </div>
      </nav>

      {/* Program areas */}
      <div id="program-areas">
        {programs.map((program, programIndex) => {
          const Icon = program.icon;

          return (
            <section
              key={program.id}
              id={program.id}
              className={`scroll-mt-20 py-16 sm:py-20 lg:py-24 ${
                programIndex % 2 === 1 ? "bg-[#f4f7f1]" : "bg-white"
              }`}
            >
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
                <div className="mb-10 flex flex-col gap-6 border-b border-[#12140f]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.17em] text-[#99751a]">
                      {program.number} / {program.eyebrow}
                    </p>

                    <h2 className="flex items-start gap-3 font-serif text-3xl font-semibold leading-tight text-[#143a30] sm:text-4xl">
                      <Icon
                        size={30}
                        className="mt-1 shrink-0 text-[#2b6558]"
                        strokeWidth={1.7}
                      />
                      {program.title}
                    </h2>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                      {program.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 self-start border border-[#143a30]/10 bg-white/70 px-4 py-3 lg:self-auto">
                    <span className="font-serif text-3xl font-semibold text-[#1d4d42]">
                      {String(program.initiatives.length).padStart(2, "0")}
                    </span>
                    <span className="text-xs leading-5 text-gray-500">
                      Initiatives
                      <br />
                      outlined
                    </span>
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-12">
                  {program.initiatives.map((initiative, index) => (
                    <InitiativeCard
                      key={initiative[0]}
                      initiative={initiative}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Closing information */}
      <section className="bg-[#f4f7f1] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid gap-8 md:grid-cols-3">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;

              return (
                <article
                  key={fact.title}
                  className="flex gap-4 border-t-2 border-[#1d4d42] pt-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-[#1d4d42]">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-[#143a30]">
                      {fact.title}
                    </h3>
                    <p className="text-sm leading-7 text-gray-600">
                      {fact.text}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className="relative isolate overflow-hidden bg-[#1d4d42]">
        <div className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10" />

        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#d9b648]">
              Be part of the movement
            </p>
            <h2 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Grow with the Agro Trade Hub Africa network.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#dcebe2] sm:text-base">
              Join farmers, cooperatives and partners working to strengthen
              agricultural production, market access and opportunities across
              Nigeria.
            </p>
          </div>

          <a
            href="/membership"
            className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#d9b648] px-7 py-4 text-sm font-bold text-[#0b1d17] transition hover:bg-white"
          >
            Join Membership
            <ArrowUpRight size={19} />
          </a>
        </div>
      </section>
    </main>
  );
}
