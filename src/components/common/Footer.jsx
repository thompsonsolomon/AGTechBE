import { X } from "lucide-react";
import { useState } from "react";

const footerGroups = [
  {
    title: "Site",
    links: [
      ["About Us", "/about"],
      ["Services", "/services"],
      ["Programs", "/programs"],
      ["Membership", "/membership"],
      ["Gallery", "/gallery"],
    ],
  },
  {
    title: "Contact",
    links: [
      ["Contact form", "/contact"],
      ["Office locations", "/contact#locations"],
    ],
  },
];

const policies = {
  privacy: {
    title: "Privacy Policy",
    body:
      "Agro Trade Hub Africa respects your privacy. Information submitted through our website should be used only for the relevant communication, membership, or service request. Contact us if you have questions about how your information is handled.",
  },
  cookies: {
    title: "Cookie Policy",
    body:
      "This website may use essential browser storage and similar technologies to support site functionality and remember preferences such as your display settings.",
  },
  payments: {
    title: "Payment and Refund Policy",
    body:
      "Please review the applicable membership or service terms before making a payment. For payment, registration, or refund enquiries, contact Agro Trade Hub Africa through the official contact page.",
  },
};

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTelegramPlane,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

const socials = [
  { label: "Telegram", href: "https://t.me/atha3752", Icon: FaTelegramPlane },
  {
    label: "WhatsApp",
    href: "https://chat.whatsapp.com/IZgIjS7drH76raPpclbS1E",
    Icon: FaWhatsapp,
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/ATHALTD/#",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/agrotradehubafrica/",
    Icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC3WOC_rURSkI4AHO_O1oyGA",
    Icon: FaYoutube,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/146681279/admin/dashboard/",
    Icon: FaLinkedinIn,
  },
];


export default function Footer() {
    const [activePolicy, setActivePolicy] = useState(null);
  return (
    <>
      <footer className="bg-[#061A14] px-5 pb-6 pt-14 text-white sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a
              href="/"
              className="flex w-fit items-center gap-3 no-underline"
            >
              <img
                src="/images/Ath2.jpeg"
                alt="Agro Trade Hub Africa logo"
                className="h-12 w-12 rounded-xl object-contain"
                loading="lazy"
              />
              <span className="font-serif text-lg font-semibold">
                Agro Trade
                <span className="block text-[#C8EA80]">Hub Africa</span>
              </span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              An initiative of Verneldos Global Services Ltd & Ntonarche Acumen
              Network.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-[#C8EA80] hover:bg-[#C8EA80] hover:text-[#0A3D33]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-5 font-semibold text-white">{group.title}</h3>
              <div className="flex flex-col items-start gap-3">
                {group.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-sm text-white/65 no-underline transition hover:text-[#C8EA80]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h3 className="mb-5 font-semibold text-white">Policies</h3>
            <div className="flex flex-col items-start gap-3">
              {Object.entries(policies).map(([key, policy]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePolicy(policy)}
                  className="text-left text-sm text-white/65 transition hover:text-[#C8EA80]"
                >
                  {policy.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Agro Trade Hub Africa.</p>

          <div className="text-left md:text-right">
            <p className="font-semibold text-white/70">
              Site designed and maintained by NTONARCH ACUMEN NETWORK
            </p>
            <p className="mt-1">
              <a
                href="https://www.ntonarch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#C8EA80]"
              >
                www.ntonarch.com
              </a>
              {" | "}
              <a
                href="mailto:ntonarch@gmail.com"
                className="transition hover:text-[#C8EA80]"
              >
                ntonarch@gmail.com
              </a>
            </p>
          </div>
        </div>
      </footer>

      {activePolicy && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setActivePolicy(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="policy-title"
            className="relative w-full max-w-xl rounded-2xl bg-white p-6 text-[#243D2F] shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              aria-label="Close policy"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F4F0] transition hover:bg-[#E0EAE0]"
            >
              <X size={19} />
            </button>

            <h2
              id="policy-title"
              className="pr-10 font-serif text-2xl font-semibold text-[#0A3D33]"
            >
              {activePolicy.title}
            </h2>

            <p className="mt-5 leading-8 text-[#52685A]">
              {activePolicy.body}
            </p>

            <button
              type="button"
              onClick={() => setActivePolicy(null)}
              className="mt-7 rounded-lg bg-[#087443] px-5 py-3 font-semibold text-white transition hover:bg-[#0A3D33]"
            >
              Close
            </button>
          </section>
        </div>
      )}
          </>

  );
}