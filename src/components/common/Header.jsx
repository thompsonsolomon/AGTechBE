import { useState } from "react";
import { Menu, X,  } from "lucide-react";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const navigation = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Programs", "/programs"],
  ["Membership", "/membership"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
];

const socials = [
  {
    label: "Telegram",
    href: "https://t.me/atha3752",
    Icon: FaTelegramPlane,
  },
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header relative z-50 w-full border-b border-[var(--line)] bg-[var(--white)]">
      <div className="wrap mx-auto flex min-h-[76px] w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:gap-6">

        {/* Logo */}
        <a
          href="/"
          aria-label="Agro Trade Hub Africa home"
          className="flex min-w-0 shrink items-center gap-2 no-underline sm:gap-3"
        >
          <img
            src="/images/Ath2.jpeg"
            alt="Agro Trade Hub Africa logo"
            className="h-10 w-10 shrink-0 rounded-xl object-contain sm:h-12 sm:w-12"
          />

          <span className="font-serif  flex text-sm font-bold leading-tight text-[var(--forest)] sm:text-base lg:text-lg">
            Agro Trade
            <span className="block text-[var(--leaf)] sm:inline sm:pl-1">
              Hub Africa
            </span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-3 xl:flex">
          {navigation.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="whitespace-nowrap border-b-2 border-transparent px-0.5 py-2 text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:border-[var(--sprout)] hover:text-[var(--leaf)]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop social icons */}
        <div className="hidden items-center gap-2 xl:flex">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="social-icon inline-flex h-8 w-8 items-center justify-center rounded-full"
            >
              <Icon size={15} />
            </a>
          ))}
        </div>

        {/* Header controls */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          {/* <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--white)] px-3 text-xs font-semibold text-[var(--forest)] transition hover:opacity-80 sm:px-4"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">
              {darkMode ? "Light mode" : "Dark mode"}
            </span>
          </button> */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--forest)] transition hover:bg-[var(--sprout)]/20 xl:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile and tablet navigation */}
      <div
        id="mobile-navigation"
        className={`absolute left-0 top-full w-full border-b border-[var(--line)] bg-[var(--white)] shadow-lg transition-all duration-200 xl:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="mx-auto flex max-h-[calc(100dvh-80px)] w-full max-w-7xl flex-col overflow-y-auto px-4 py-4 sm:px-6">
          {navigation.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={closeMenu}
              className="border-b border-[var(--line)] px-3 py-3.5 text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:bg-[var(--sprout)]/10 hover:text-[var(--leaf)]"
            >
              {label}
            </a>
          ))}

          {/* Social links on mobile and tablet */}
          <div className="flex flex-wrap items-center gap-3 pt-5">
            <span className="w-full text-xs font-semibold uppercase tracking-wider text-[var(--ink)] opacity-70">
              Connect with us
            </span>

            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="social-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--forest)] transition hover:bg-[var(--sprout)]/20"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
