import { NextRequest, NextResponse } from "next/server";

interface WebringEntry {
  id: string;
  username: string;
  url: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastVisited: string;
  visitCount: number;
}

interface WebringResponse {
  success: boolean;
  redirectUrl?: string;
  username?: string;
  entry?: WebringEntry;
  message?: string;
  error?: string;
}

const WEB_RING_ENTRIES: WebringEntry[] = [
  {
    id: "1",
    username: "braderdin",
    url: "https://braderdin.com",
    title: "Braderdin - Digital Artisan",
    description: "Kreator konten digital dan pengembang perisian",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastVisited: new Date().toISOString(),
    visitCount: 1247,
  },
  {
    id: "2",
    username: "kampung-siber",
    url: "https://kampung-siber.vercel.app",
    title: "Kampung Siber Retro",
    description: "Persepetaran dalam talian dengan gaya retro",
    isActive: true,
    createdAt: "2024-02-01T00:00:00Z",
    lastVisited: new Date().toISOString(),
    visitCount: 892,
  },
  {
    id: "3",
    username: "cyber-tambang",
    url: "https://cyber-tambang.vercel.app",
    title: "Cyber Tambang",
    description: "Petualangan dalam talian",
    isActive: true,
    createdAt: "2024-03-01T00:00:00Z",
    lastVisited: new Date().toISOString(),
    visitCount: 563,
  },
  {
    id: "4",
    username: "pixel-dreams",
    url: "https://pixel-dreams.vercel.app",
    title: "Pixel Dreams",
    description: "Kreativiti pixel dan seni digital",
    isActive: true,
    createdAt: "2024-04-01T00:00:00Z",
    lastVisited: new Date().toISOString(),
    visitCount: 1128,
  },
  {
    id: "5",
    username: "neon-sunset",
    url: "https://neon-sunset.vercel.app",
    title: "Neon Sunset",
    description: "Estetika neon dan cyberpunk",
    isActive: true,
    createdAt: "2024-05-01T00:00:00Z",
    lastVisited: new Date().toISOString(),
    visitCount: 754,
  },
];

const getRandomEntry = (): WebringEntry | null => {
  const activeEntries = WEB_RING_ENTRIES.filter(entry => entry.isActive);
  if (activeEntries.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * activeEntries.length);
  return activeEntries[randomIndex];
};

const getEntryByUsername = (username: string): WebringEntry | undefined => {
  return WEB_RING_ENTRIES.find(entry => 
    entry.username.toLowerCase() === username.toLowerCase()
  );
};

const getNextEntry = (currentUsername: string): WebringEntry | null => {
  const currentIndex = WEB_RING_ENTRIES.findIndex(
    entry => entry.username.toLowerCase() === currentUsername.toLowerCase()
  );
  
  if (currentIndex === -1) {
    return getRandomEntry();
  }
  
  const nextIndex = (currentIndex + 1) % WEB_RING_ENTRIES.length;
  return WEB_RING_ENTRIES[nextIndex];
};

export async function GET(req: NextRequest): Promise<NextResponse<WebringResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const random = searchParams.get("random");
    const next = searchParams.get("next");

    let targetEntry: WebringEntry | null = null;

    if (random === "true") {
      targetEntry = getRandomEntry();
    } else if (next === "true" && username) {
      targetEntry = getNextEntry(username);
    } else if (username) {
      const foundEntry = getEntryByUsername(username);
      if (foundEntry) {
        targetEntry = getNextEntry(foundEntry.username);
      } else {
        targetEntry = getRandomEntry();
      }
    } else {
      targetEntry = getRandomEntry();
    }

    if (!targetEntry) {
      return NextResponse.json({
        success: false,
        error: "Tiada entri webring yang tersedia",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: targetEntry.url,
      username: targetEntry.username,
      entry: targetEntry,
      message: `Mengalihkan ke ${targetEntry.title}`,
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing webring redirect:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memproses permintaan",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse<WebringResponse>> {
  try {
    const body = await req.json();
    
    const { username, action } = body;

    if (!username) {
      return NextResponse.json({
        success: false,
        error: "Username diperlukan",
      }, { status: 400 });
    }

    let targetEntry: WebringEntry | null = null;

    switch (action) {
      case "next":
        targetEntry = getNextEntry(username);
        break;
      case "random":
        targetEntry = getRandomEntry();
        break;
      default:
        targetEntry = getEntryByUsername(username) || getRandomEntry();
    }

    if (!targetEntry) {
      return NextResponse.json({
        success: false,
        error: "Entri tidak ditemui",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: targetEntry.url,
      username: targetEntry.username,
      entry: targetEntry,
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing webring action:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memproses aksi",
    }, { status: 500 });
  }
}

export async function HEAD(req: NextRequest): Promise<NextResponse> {
  try {
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const runtime = "nodejs";