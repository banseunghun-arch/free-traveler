import Link from "next/link";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/travel-tools", label: "여행 도구" },
  { href: "/mates", label: "동행" },
  { href: "/account", label: "계정" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e5e3e0] bg-white">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center gap-8">
        <Link href="/" className="text-[18px] font-bold text-[#262626]">
          Free Traveler
        </Link>

        <nav className="hidden md:flex gap-6 ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#4b4b4b] hover:text-[#262626] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
