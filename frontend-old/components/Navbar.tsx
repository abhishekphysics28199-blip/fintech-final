import Link from "next/link";

export function Navbar() {
  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-navy/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-saffron">Fintech.AI</span>
          <span className="hidden text-sm text-white/70 sm:inline">
            Your All-Time Friend to Help You
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <Link href="/chat" className="hover:text-white">
            Chat
          </Link>
          <Link href="/scams" className="hover:text-white">
            Scams
          </Link>
          <Link href="/report" className="hover:text-white">
            Report
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

