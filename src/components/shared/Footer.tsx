const footerLinks = [
  { label: "이용약관", href: "#" },
  { label: "개인정보 처리방침", href: "#" },
  { label: "동행 안전수칙", href: "#" },
  { label: "콘텐츠 면책 안내", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-[#e5e3e0] bg-[#f7f6f4] mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6">
          <p className="text-[14px] font-semibold text-[#262626] mb-4">지원</p>
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] text-[#767676] hover:text-[#262626] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#e5e3e0]">
          <p className="text-[12px] text-[#767676]">
            © 2024 Free Traveler. 모든 권리 보유.
          </p>
        </div>
      </div>
    </footer>
  );
}
