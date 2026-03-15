import { LanguageSelector } from "@/components/LanguageSelector";
import { Navbar } from "@/components/Navbar";
import { ScamTicker } from "@/components/ScamTicker";

export default function HomePage() {
  return (
    <div>
      <ScamTicker />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <div className="text-3xl font-bold text-white">
            <span className="text-saffron">Fintech.AI</span>
          </div>
          <div className="mt-1 text-white/70">All time friend to help you</div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <LanguageSelector />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white">What you can ask</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80">
              <li>I received a call claiming to be bank customer care.</li>
              <li>Someone asked me to share UPI PIN/OTP.</li>
              <li>I clicked a link and my account got debited.</li>
              <li>How do I report fraud on cybercrime.gov.in?</li>
            </ul>
            <div className="mt-4 rounded-xl border border-saffron/30 bg-saffron/10 p-3 text-sm text-white/90">
              If the fraud is ongoing: call <span className="font-semibold">1930</span> immediately.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

