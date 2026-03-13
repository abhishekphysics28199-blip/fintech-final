import { Navbar } from "@/components/Navbar";
import { ScamTicker } from "@/components/ScamTicker";

export default function ReportPage() {
  return (
    <div>
      <ScamTicker />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-2xl font-semibold text-white">How to report a fraud</div>
          <div className="mt-2 text-white/80">
            If you are currently being scammed or money just got debited, call <b>1930</b> immediately.
          </div>

          <ol className="mt-5 list-decimal space-y-3 pl-6 text-white/80">
            <li>
              Go to <a className="text-saffron underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
                cybercrime.gov.in
              </a>{" "}
              and choose “Report Cyber Crime”.
            </li>
            <li>Keep screenshots/call recordings/SMS, UPI transaction IDs, bank statements ready.</li>
            <li>For UPI/card/netbanking fraud, also inform your bank immediately and request a transaction dispute.</li>
            <li>If you shared OTP/UPI PIN, change passwords/MPINs and block cards right away.</li>
          </ol>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
            Official references:
            <div className="mt-2 flex flex-wrap gap-2">
              <a className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">
                NCRP (Cybercrime Portal)
              </a>
              <a className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10" href="https://www.rbi.org.in" target="_blank" rel="noreferrer">
                RBI
              </a>
              <a className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10" href="https://www.sebi.gov.in" target="_blank" rel="noreferrer">
                SEBI
              </a>
              <a className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10" href="https://www.npci.org.in" target="_blank" rel="noreferrer">
                NPCI
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

