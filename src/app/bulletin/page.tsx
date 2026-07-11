import { BBSBulletinBoard } from "@/components/BBSBulletinBoard";
import HydrationGuard from "@/components/HydrationGuard";

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  priority?: "low" | "medium" | "high";
  isPinned?: boolean;
}

interface BulletinData {
  posts: Post[];
  total: number;
}

// Start: Internal sample data to avoid server-side fetch issues
const getBulletinPosts = (): BulletinData => {
  const posts: Post[] = [
    {
      id: "1",
      title: "Selamat datang ke Pangkalan Notis Kampung Siber!",
      author: "Pejabat Kampung",
      content: "Komuniti kini aktif! Sertai perbincangan dan kongsi idea anda.",
      createdAt: new Date().toISOString(),
      priority: "high",
      isPinned: true
    },
    {
      id: "2",
      title: "Kemaskini Platform Retro",
      author: "Penyelenggara",
      content: "Antaramuka retro baharu kini diluncurkan. Elakkan idea 1990-an ini!",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      priority: "medium"
    },
    {
      id: "3",
      title: "Arkib Arcade Diperbaharui",
      author: "Pentadbir Arcade",
      content: "Dua lagi game retro telah ditambah: Retro Pong dan Retro Snake",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      priority: "low"
    }
  ];
  
  return { posts, total: posts.length };
};
// End: Internal sample data

export default async function BulletinPage() {
  // Use internal data directly instead of fetching during static generation
  const { posts, total } = getBulletinPosts();

  const pinnedPosts = posts.filter(p => p.isPinned);
  const regularPosts = posts.filter(p => !p.isPinned);

  return (
    <HydrationGuard>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="font-pixel text-4xl text-white mb-2">
              Pangkalan Notis Kampung
            </h1>
            <p className="font-pixel text-xs text-gray-400">
              {total} pemberitahuan · Diperbaharui semalam
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {pinnedPosts.length > 0 && (
                  <section className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                    <h2 className="font-pixel text-sm text-amber-400 mb-3">
                      ⭐ Ditetapkan (Pinned)
                    </h2>
                    {pinnedPosts.map((post) => (
                      <article
                        key={post.id}
                        className="mb-3 p-3 bg-amber-900/10 border-l-4 border-amber-500 rounded"
                      >
                        <h3 className="font-pixel text-sm text-white mb-1">
                          {post.title}
                        </h3>
                        <p className="font-pixel text-xs text-amber-200 mb-1">
                          {post.content}
                        </p>
                        <div className="font-pixel text-xs text-amber-300">
                          {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </article>
                    ))}
                  </section>
                )}

                <section>
                  <h2 className="font-pixel text-sm text-gray-300 mb-3">Pemberitahuan Terbaru</h2>
                  {regularPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="font-pixel text-xs text-gray-500">
                        Tiada pemberitahuan terkini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {regularPosts.map((post) => (
                        <article
                          key={post.id}
                          className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4"
                        >
                          <h3 className="font-pixel text-sm text-white mb-1">
                            {post.title}
                          </h3>
                          <p className="font-pixel text-xs text-gray-300 mb-2">
                            {post.content}
                          </p>
                          <div className="font-pixel text-xs text-gray-500">
                            {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>

            <div className="space-y-6">
              <section className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                <h2 className="font-pixel text-sm text-gray-300 mb-3">Lancar Cepat</h2>
                <div className="space-y-2">
                  <a
                    href="/site"
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    🏠 Halaman Utama
                  </a>
                  <a
                    href="/bbs-room"
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    💬 Bilik Chat
                  </a>
                  <a
                    href="/arcade"
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    🎮 Arcade
                  </a>
                  <a
                    href="/guestbook"
                    className="block font-pixel text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    📓 Guestbook
                  </a>
                </div>
              </section>

              <section className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                <h2 className="font-pixel text-sm text-gray-300 mb-3">Statistik</h2>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-800/30 p-2 rounded">
                    <div className="font-pixel text-xs text-gray-400">Posts</div>
                    <div className="font-pixel text-lg text-white">{total}</div>
                  </div>
                  <div className="bg-gray-800/30 p-2 rounded">
                    <div className="font-pixel text-xs text-gray-400">Pinned</div>
                    <div className="font-pixel text-lg text-white">{pinnedPosts.length}</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </HydrationGuard>
  );
}