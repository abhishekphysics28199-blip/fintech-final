import { ChatWindow } from "@/components/ChatWindow";
import { Navbar } from "@/components/Navbar";
import { ScamTicker } from "@/components/ScamTicker";

export default function ChatPage() {
  return (
    <div>
      <ScamTicker />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-4">
          <div className="text-xl font-semibold text-white">Chat</div>
          <div className="text-sm text-white/70">
            Fintech.AI replies in your selected language and always includes official reporting links.
          </div>
        </div>
        <ChatWindow />
      </main>
    </div>
  );
}

