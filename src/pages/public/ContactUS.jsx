import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowUpRight,
  Building2,
  Search,
  Menu,
  X,
  CheckCircle2,
  Handshake,
  Globe,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
} from "react-icons/fa";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const EMAIL = "agrotradehubs@gmail.com";

const PHONES = [
  "+234 907 194 6779",
  "+234 901 340 1106",
  "+234 802 386 8928",
  "+234 810 356 2802",
];

const SUBJECTS = [
  "Partnership discussion",
  "Trade support",
  "Corporate representation",
  "General enquiry",
];

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://web.facebook.com/ATHALTD/#",
    Icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/agrotradehubafrica/",
    Icon: FaInstagram,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UC3WOC_rURSkI4AHO_O1oyGA",
    Icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/146681279/admin/dashboard/",
    Icon: FaLinkedinIn,
  },
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/IZgIjS7drH76raPpclbS1E",
    Icon: FaWhatsapp,
  },
  {
    name: "Telegram",
    href: "https://t.me/atha3752",
    Icon: FaTelegramPlane,
  },
];

const OFFICES = [
  {
    title: "Head Office",
    address:
      "58 Marian Road, by IBB Roundabout, Calabar, Cross River State, Nigeria",
  },
  {
    title: "North Central — Benue Chapter",
    address:
      "RCM Primary School, Nyihemba Maav-ya, Turan, Kwande LGA, Benue State",
  },
  {
    title: "Yakurr LGA Office",
    address:
      "No. 1, Epono Extension, Nko Abanankpai, Cross River State, Nigeria",
  },
  {
    title: "South-South Office",
    address: "316 Nwaniba Road, Uyo, Akwa Ibom State",
  },
  {
    title: "IKOM Office",
    address:
      "Oje Mathew Avenue, beside Christ Embassy Church, Agric Road",
  },
];

const STATE_GROUPS = [
  ["Abia", "https://chat.whatsapp.com/Jcj5GKdft7c4K6vq3SGlhJ"],
  ["Adamawa", "https://chat.whatsapp.com/JPObYFDjWU62HPo4WPQIUF"],
  ["Akwa Ibom", "https://chat.whatsapp.com/Bd9ZN5UwGx0105ZyOyoAm7"],
  ["Anambra", "https://chat.whatsapp.com/Ei05Rby6GG0JLYZoMKCDD7"],
  ["Bauchi", "https://chat.whatsapp.com/FxZc8UVr8p84vSmmHnmIDy"],
  ["Bayelsa", "https://chat.whatsapp.com/IQNvuvHk5GqIRL7UGLVw2Q"],
  ["Benue", "https://chat.whatsapp.com/DnHL3qbmyqO2AMKlVGEsWM"],
  ["Borno", "https://chat.whatsapp.com/ByfN8xTNxUeEYzDm2LhI24"],
  ["Cross River", "https://chat.whatsapp.com/Kh6QYOHFxDQ2Z3HKRB4cLx"],
  ["Delta", "https://chat.whatsapp.com/JuO4F8W0aPp9d1SCMcnMxh"],
  ["Ebonyi", "https://chat.whatsapp.com/EQdcg1Qifhm1d9bm3VNNTT"],
  ["Edo", "https://chat.whatsapp.com/KEv7NJBsvNPIV32D8OP8mB"],
  ["Ekiti", "https://chat.whatsapp.com/IFFI6jEtZ9yDez78g8hc39"],
  ["Enugu", "https://chat.whatsapp.com/LyCS13VZSe3GIMuQHFmBg0"],
  ["FCT Abuja", "https://chat.whatsapp.com/LarTf6ZdFaA4maB3W4kNWZ"],
  ["Gombe", "https://chat.whatsapp.com/IgF1zVb77VmJKx5m7E4O5c"],
  ["Imo", "https://chat.whatsapp.com/Cmr8OH5uKxK2bdFCIqU7qn"],
  ["Jigawa", "https://chat.whatsapp.com/KVe2f3mi9G8KTv9lFDws6C"],
  ["Kaduna", "https://chat.whatsapp.com/ERlUBE3l3TJCnOCc3yyPZf"],
  ["Kano", "https://chat.whatsapp.com/Fud4QAP12bU4wk0gApVJ7P"],
  ["Katsina", "https://chat.whatsapp.com/DHLF2HSUMu75dhTn5Dmm0z"],
  ["Kebbi", "https://chat.whatsapp.com/Kb1PGELpF4VBjeWU9PcZEa"],
  ["Kogi", "https://chat.whatsapp.com/Jq7CP3p9u9N7QkNa7HuMKn"],
  ["Kwara", "https://chat.whatsapp.com/BfiCVy1HGQJ7ogepAcFuXS"],
  ["Lagos", "https://chat.whatsapp.com/IhZmsbkuHHW5TqT0NmM0jH"],
  ["Nasarawa", "https://chat.whatsapp.com/JZQg89EsYKa9qkdLMx1z8u"],
  ["Niger", "https://chat.whatsapp.com/LCcJfprPAyL4c7vBAgZtqw"],
  ["Ogun", "https://chat.whatsapp.com/LB4Tknx4gAfEL9opDX19QN"],
  ["Ondo", "https://chat.whatsapp.com/JZQg89EsYKa9qkdLMx1z8u"],
  ["Osun", "https://chat.whatsapp.com/JOQBxVnLw0N5bcecDYY50Y"],
  ["Oyo", "https://chat.whatsapp.com/IEjW2Mujwg59QNa0UdKSKL"],
  ["Plateau", "https://chat.whatsapp.com/C0gUcn43FMn4994rOQTLtT"],
  ["Rivers", "https://chat.whatsapp.com/CGkTBbyQVjhKrMWtzWRz79"],
  ["Sokoto", "https://chat.whatsapp.com/H81tOnc8bRz47jGFAGfUIG"],
  ["Taraba", "https://chat.whatsapp.com/HJRpxfQI03l9wpelFHhscR"],
  ["Yobe", "https://chat.whatsapp.com/L27HORMrcsgFDhQKhAD3ih"],
  ["Zamfara", "https://chat.whatsapp.com/J7Kswgx6eYNALxV5F6dpoQ"],
];

const inputClass =
  "block w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#173629] outline-none transition placeholder:text-gray-400 focus:border-[#28794f] focus:ring-2 focus:ring-[#28794f]/15";

function SectionTitle({ eyebrow, title, description, center = false }) {
  return (
    <div className={`min-w-0 ${center ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#28794f]">
        {eyebrow}
      </p>
      <h2 className="break-words text-3xl font-bold leading-tight tracking-tight text-[#123326] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export default function ContactUS() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    subject: SUBJECTS[0],
    message: "",
  });

  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileGroupsOpen, setMobileGroupsOpen] = useState(false);

  const filteredGroups = STATE_GROUPS.filter(([state]) =>
    state.toLowerCase().includes(search.trim().toLowerCase())
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setNotice("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const subject = encodeURIComponent(
      `${form.subject} — ${form.name}`
    );

    const body = encodeURIComponent(
      `Full name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone || "Not provided"}\n` +
        `State: ${form.state || "Not provided"}\n` +
        `Subject: ${form.subject}\n\n` +
        `Message:\n${form.message}`
    );

    window.location.href =
      `mailto:${EMAIL}?subject=${subject}&body=${body}`;

    setNotice(
      "Your email application should open with your message prepared. Send the email from that application to complete your enquiry."
    );
  }

  return (
   <>
   <Header />
    <main className="w-full min-w-0 overflow-x-clip bg-white text-[#173629]">

      {/* HERO */}
      <section className="relative isolate w-full overflow-hidden bg-[#0b241a]">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-emerald-700/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-24">

          <div className="min-w-0">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-200 sm:px-4 sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#d9bd56]" />
              Agro Trade Hub Africa
            </div>

            <h1 className="max-w-2xl break-words text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let's build the next phase of{" "}
              <span className="text-[#d9bd56]">growth.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
              Whether you need partnership discussions, trade support, or
              corporate representation, we are ready to engage.
            </p>

            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <a
                href="#contact-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d9bd56] px-5 py-3 text-sm font-bold text-[#152d22] transition hover:bg-[#e9d47d]"
              >
                Send an enquiry <ArrowUpRight size={17} />
              </a>

              <a
                href="https://wa.me/2349071946779"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 border-t border-white/15 pt-6 min-[420px]:grid-cols-2 sm:mt-12 sm:pt-7">
              <div>
                <p className="text-sm font-semibold text-white">
                  Partnership enquiries
                </p>
                <p className="mt-1 text-xs leading-6 text-gray-400">
                  Explore opportunities to collaborate.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Nationwide network
                </p>
                <p className="mt-1 text-xs leading-6 text-gray-400">
                  Connect with our state communities.
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 w-full">
            <div className="rounded-2xl border border-white/10 bg-[#143729] p-5 shadow-2xl sm:rounded-3xl sm:p-8 lg:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d9bd56] text-[#153326]">
                  <Handshake size={24} />
                </div>
                <span className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#d9bd56]">
                  Let's connect
                </span>
              </div>

              <h2 className="mt-6 break-words text-2xl font-bold text-white sm:text-3xl">
                How can we work together?
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-300">
                We welcome enquiries from farmers, cooperatives, businesses,
                investors and prospective partners.
              </p>

              <a
                href={`mailto:${EMAIL}`}
                className="mt-6 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 sm:gap-4 sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9bd56]/15 text-[#d9bd56]">
                  <Mail size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-gray-400">Email us</span>
                  <span className="mt-1 block break-all text-sm font-semibold text-white">
                    {EMAIL}
                  </span>
                </span>
                <ArrowUpRight size={17} className="shrink-0 text-gray-400" />
              </a>

              <a
                href="https://t.me/atha3752"
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 sm:gap-4 sm:p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9bd56]/15 text-[#d9bd56]">
                  <FaTelegramPlane size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs text-gray-400">Join our community</span>
                  <span className="mt-1 block break-words text-sm font-semibold text-white">
                    Agro Trade Hub on Telegram
                  </span>
                </span>
                <ArrowUpRight size={17} className="shrink-0 text-gray-400" />
              </a>

              <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                <Globe className="mt-1 shrink-0 text-[#d9bd56]" size={18} />
                <p className="text-xs leading-6 text-gray-300">
                  Connecting agricultural opportunities across Nigeria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact-form" className="w-full min-w-0 bg-[#f5f7f2] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl min-w-0 grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

          <div className="min-w-0">
            <SectionTitle
              eyebrow="Send us a message"
              title="Start a conversation."
              description="Complete the form below and tell us how we can help. Provide accurate contact details so we can identify your enquiry."
            />

            <form
              onSubmit={handleSubmit}
              className="mt-7 min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mt-9 sm:p-7 lg:p-8"
            >
              <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="min-w-0">
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold">
                    Phone number
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 ..."
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label htmlFor="contact-state" className="mb-2 block text-sm font-semibold">
                    State
                  </label>
                  <input
                    id="contact-state"
                    name="state"
                    type="text"
                    placeholder="Your state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">
                    Enquiry type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    {SUBJECTS.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">
                    Your message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us about your enquiry or proposed partnership..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>
              </div>

              {notice && (
                <div role="status" className="mt-5 flex min-w-0 items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  <p className="min-w-0 break-words">{notice}</p>
                </div>
              )}

              <button
                type="submit"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17643f] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#104c2e] focus:outline-none focus:ring-4 focus:ring-green-700/20 sm:w-auto"
              >
                Prepare email <Send size={17} />
              </button>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                Your default email application will open with the message
                prepared. You must send it from that application.
              </p>
            </form>
          </div>

          {/* CONTACT DETAILS */}
          <aside className="flex min-w-0 flex-col gap-5 lg:pt-1">
            <div className="min-w-0 rounded-2xl bg-[#0d2c20] p-5 text-white sm:p-7 lg:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9bd56]">
                Reach our team
              </p>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">
                We're ready to listen.
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                Contact us for enquiries, collaboration and general support.
              </p>

              <div className="mt-7 space-y-6">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d9bd56]">
                    <MapPin size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold">Head office</h4>
                    <p className="mt-2 break-words text-sm leading-6 text-gray-300">
                      58 Marian Road, by IBB Roundabout, Calabar, Cross River State, Nigeria
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=58+Marian+Road+Calabar+Cross+River+Nigeria"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#d9bd56] hover:underline"
                    >
                      Get directions <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d9bd56]">
                    <Phone size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold">Phone numbers</h4>
                    <div className="mt-2 space-y-2">
                      {PHONES.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="block break-words text-sm text-gray-300 hover:text-[#d9bd56]"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d9bd56]">
                    <Mail size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold">Email address</h4>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="mt-2 block break-all text-sm text-gray-300 hover:text-[#d9bd56]"
                    >
                      {EMAIL}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-bold text-[#153729]">
                Connect with us online
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Choose a community channel to connect with Agro Trade Hub Africa.
              </p>

              <a
                href="https://chat.whatsapp.com/IZgIjS7drH76raPpclbS1E"
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex min-w-0 items-center justify-between gap-3 rounded-xl bg-green-50 p-4 transition hover:bg-green-100"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <FaWhatsapp size={22} className="shrink-0 text-green-700" />
                  <span className="break-words text-sm font-semibold text-[#173629]">
                    WhatsApp community
                  </span>
                </span>
                <ArrowUpRight size={17} className="shrink-0" />
              </a>

              <a
                href="https://t.me/atha3752"
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex min-w-0 items-center justify-between gap-3 rounded-xl bg-blue-50 p-4 transition hover:bg-blue-100"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <FaTelegramPlane size={22} className="shrink-0 text-blue-600" />
                  <span className="break-words text-sm font-semibold text-[#173629]">
                    Telegram channel
                  </span>
                </span>
                <ArrowUpRight size={17} className="shrink-0" />
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="w-full min-w-0 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#28794f]">
              Stay connected
            </p>
            <h2 className="mt-2 break-words text-2xl font-bold text-[#123326] sm:text-3xl">
              Follow our journey.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Follow our activities, updates and opportunities through our official channels.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {SOCIALS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
                title={name}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-[#17643f] transition hover:border-[#17643f] hover:bg-[#17643f] hover:text-white sm:h-12 sm:w-12"
              >
                <Icon size={19} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section className="w-full min-w-0 bg-[#f5f7f2] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl min-w-0">
          <SectionTitle
            eyebrow="Our locations"
            title="Find an office near you."
            description="Explore our listed offices and chapter locations to identify the most convenient point of contact."
          />

          <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3">
            {OFFICES.map((office, index) => (
              <article
                key={office.title}
                className="flex min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-green-200 hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#17643f]">
                    <Building2 size={21} />
                  </span>
                  {index === 0 && (
                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-800">
                      Head office
                    </span>
                  )}
                </div>

                <h3 className="mt-5 break-words text-lg font-bold text-[#153729]">
                  {office.title}
                </h3>
                <p className="mt-3 flex-1 break-words text-sm leading-6 text-gray-600">
                  {office.address}
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#17643f] hover:underline"
                >
                  View on map <ArrowUpRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP STATE GROUPS */}
      <section className="w-full min-w-0 px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto   w-full max-w-7xl min-w-0 grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
          <div className="min-w-0">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <FaWhatsapp size={25} />
            </span>

            <div className="mt-5">
              <SectionTitle
                eyebrow="Our state communities"
                title="Connect with your state network."
                description="Find your state and join its Agro Trade Hub Africa WhatsApp community to connect with other members."
              />
            </div>

            <div className="mt-6 rounded-2xl bg-[#0d2c20] p-5 text-white sm:p-6">
              <h3 className="text-lg font-bold">Member communities</h3>
              <p className="mt-3 text-sm leading-7 text-gray-300">
                Select your state to open its invitation link. Access is subject to each group's settings.
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                <Globe size={19} className="shrink-0 text-[#d9bd56]" />
                <p className="text-sm text-gray-200">
                  {STATE_GROUPS.length} state and FCT listings
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 mt-20">
            <div className="relative mb-5">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for your state..."
                aria-label="Search state WhatsApp groups"
                className={`${inputClass} pl-11`}
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {filteredGroups.map(([state, href]) => (
                <a
                  key={state}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-green-300 hover:bg-green-50 sm:gap-3 sm:p-4"
                >
                  <span className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                      <FaWhatsapp size={18} />
                    </span>
                    <span className="min-w-0 break-words text-sm font-semibold text-[#193b2b]">
                      {state}
                    </span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-gray-400" />
                </a>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <Search size={26} className="mx-auto text-gray-400" />
                <p className="mt-3 font-semibold">No matching state found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Try another state name.
                </p>
              </div>
            )}

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Please verify the Ondo WhatsApp invitation: the supplied URL is
              identical to the Nasarawa invitation.
            </p>
          </div>
        </div>
      </section>

      {/* HEAD OFFICE MAP */}
      <section className="w-full min-w-0 bg-[#f5f7f2] px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl min-w-0">
          <div className="mb-7 flex min-w-0 flex-col gap-5 sm:mb-8 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <SectionTitle
                eyebrow="Visit us"
                title="Our head office."
                description="Find Agro Trade Hub Africa on Marian Road, Calabar, Cross River State."
              />
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=58+Marian+Road+Calabar+Cross+River+Nigeria"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#17643f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#104c2e] sm:w-fit"
            >
              Open Google Maps <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:p-2">
            <iframe
              title="Agro Trade Hub Africa head office in Calabar"
              src="https://maps.google.com/maps?q=58%20Marian%20Road%2C%20Calabar%2C%20Cross%20River%20State%2C%20Nigeria&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, height: "clamp(280px, 55vw, 430px)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full min-w-0 px-4 py-12 sm:px-6 sm:py-20 lg:px-10">
        <div className="relative mx-auto w-full max-w-7xl min-w-0 overflow-hidden rounded-2xl bg-[#0d2c20] px-5 py-10 sm:rounded-3xl sm:px-9 sm:py-14 lg:px-12 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex min-w-0 flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="min-w-0 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9bd56]">
                Let's move forward
              </p>
              <h2 className="mt-4 break-words text-3xl font-bold leading-tight text-white sm:text-4xl">
                Have an opportunity worth discussing?
              </h2>
              <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base">
                Start a conversation about your enquiry, collaboration or agricultural business objectives.
              </p>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row lg:w-auto lg:shrink-0">
              <a
                href="#contact-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d9bd56] px-5 py-3.5 text-sm font-bold text-[#152d22] transition hover:bg-[#e9d47d]"
              >
                Contact our team <ArrowUpRight size={17} />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Mail size={17} /> Email us
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
    <Footer />
       </>

  );
}
