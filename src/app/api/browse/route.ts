// Start: Browse API Route — returns catalog JSON (empty by default)
// Provides the /api/browse endpoint consumed by src/app/browse/page.tsx.
// Without this route the client fetch received a 404 HTML document and
// response.json() threw "Unexpected token '<'". We now return a stable,
// well-formed JSON payload so the browse grid renders its empty-state.
import { NextResponse } from "next/server";

interface BrowseItem {
  id: string;
  title: string;
  description: string;
  type: "tutorial" | "asset" | "project" | "template";
  thumbnail: string;
  author: string;
  tags: string[];
  downloads: number;
  rating: number;
  url: string;
}

// Start: In-memory default catalog (empty until Supabase-backed source lands)
const DEFAULT_CATALOG: BrowseItem[] = [];
// End: In-memory default catalog

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sortBy") || "popular";
  const search = (searchParams.get("search") || "").toLowerCase();
  const page = Number(searchParams.get("page") || "1");
  const perPage = 12;

  // Start: Lightweight filter/sort to mirror client expectations
  let results = [...DEFAULT_CATALOG];
  if (type !== "all") {
    results = results.filter((item) => item.type === type);
  }
  if (search) {
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tags.some((tag) => tag.toLowerCase().includes(search))
    );
  }
  if (sortBy === "newest") {
    results = results.reverse();
  } else if (sortBy === "rating") {
    results = results.sort((a, b) => b.rating - a.rating);
  } else {
    results = results.sort((a, b) => b.downloads - a.downloads);
  }
  // End: Lightweight filter/sort

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = results.slice(start, start + perPage);

  return NextResponse.json({
    success: true,
    data: paged,
    error: null,
    pagination: { page, totalPages, total },
  });
}
// End: Browse API Route