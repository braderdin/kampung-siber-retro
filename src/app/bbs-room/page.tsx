import { Metadata } from "next";
import BbsChatRoom from "@/components/BbsChatRoom";

export const metadata: Metadata = {
  title: "Bbs Room - Kampung Siber Retro",
  description: "Sala berhadapan BBS berskala besar dengan chat bersebenara",
  openGraph: {
    title: "Bbs Room - Kampung Siber Retro",
    description: "Sala berhadapan BBS berskala besar dengan chat bersebenara",
  },
};

export default function BbsRoomPage() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-gray-800/30 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xl pixel-font font-bold text-white">ᴀ</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-200 pixel-font">
                BBS Room
              </h1>
              <p className="text-xs text-gray-500 pixel-font">
                Sala berhadapan klasik 90-an
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 pixel-font">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Terhubung ke Internet</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 relative z-10">
          <BbsChatRoom
            roomName="Kampung Siber BBS"
            className="h-full"
            maxMessages={200}
          />
        </main>
        
        <footer className="p-3 bg-gray-800/30 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 pixel-font">
            <div className="flex items-center gap-4">
              <span>Shift + Enter untuk newline</span>
              <span>Ctrl + K untuk clear</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Version 1.0.0</span>
              <span className="text-gray-600">|</span>
              <span>© 2024 Kampung Siber</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}