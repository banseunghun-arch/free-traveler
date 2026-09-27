import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-[32px] font-bold text-[#262626] mb-4">404</h1>
      <h2 className="text-[18px] font-semibold text-[#262626] mb-2">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-[16px] text-[#4b4b4b] mb-8 max-w-sm">
        찾으시던 페이지가 없거나 주소가 잘못되었습니다.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#d03e1b] text-white rounded-[8px] font-semibold hover:bg-[#b23417] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
      >
        홈으로 이동
      </Link>
    </div>
  );
}
