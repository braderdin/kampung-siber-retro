import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "https://localhost:6379",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "default-token",
});

interface ProfileViewsRequest {
  userId: string;
  profileId: string;
  timestamp?: string;
  userAgent?: string;
  ip?: string;
}

interface ProfileViewsResponse {
  success: boolean;
  data?: {
    totalViews: number;
    uniqueViews: number;
    lastUpdated: string;
    cacheKey: string;
  };
  error?: string;
}

const VIEW_CACHE_TTL = 3600;
const UNIQUE_VIEW_WINDOW = 86400;

export async function POST(req: NextRequest): Promise<NextResponse<ProfileViewsResponse>> {
  try {
    const body = await req.json();
    
    const { userId, profileId, timestamp, userAgent, ip }: ProfileViewsRequest = body;

    if (!userId || !profileId) {
      return NextResponse.json({
        success: false,
        error: "ID pengguna dan ID profil diperlukan",
      }, { status: 400 });
    }

    const cacheKey = `profile_views:${userId}:${profileId}`;
    const uniqueKey = `profile_unique:${userId}:${profileId}:${new Date().toISOString().split("T")[0]}`;
    const hourlyKey = `profile_hourly:${userId}:${profileId}:${Date.now()}`;

    const now = Date.now();
    const ts = timestamp || new Date().toISOString();

    await redis.incr(cacheKey);
    await redis.expire(cacheKey, VIEW_CACHE_TTL);

    const uniqueKeyBase = `profile_unique_view:${userId}:${profileId}`;
    const hashKey = `${uniqueKeyBase}:${Math.floor(now / 1000)}`;
    
    const isUnique = await redis.setnx(hashKey, "1");
    if (isUnique) {
      await redis.expire(hashKey, UNIQUE_VIEW_WINDOW);
    }

    const cacheValue = await redis.get<string>(cacheKey) || "0";
    const totalViews = parseInt(cacheValue, 10);

    const uniqueViewsKey = `profile_unique_total:${userId}:${profileId}`;
    const uniqueViewsRaw = await redis.get<string>(uniqueViewsKey) || "0";
    const uniqueViews = parseInt(uniqueViewsRaw, 10);

    await redis.incr(uniqueViewsKey);
    await redis.expire(uniqueViewsKey, VIEW_CACHE_TTL * 24);

    const hourlyViews = await redis.get<string>(hourlyKey) || "0";
    await redis.incr(hourlyKey);
    await redis.expire(hourlyKey, 3600);

    const response: ProfileViewsResponse = {
      success: true,
      data: {
        totalViews,
        uniqueViews,
        lastUpdated: ts,
        cacheKey,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error updating profile views:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memproses permintaan",
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse<ProfileViewsResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const profileId = searchParams.get("profileId");

    if (!userId || !profileId) {
      return NextResponse.json({
        success: false,
        error: "ID pengguna dan ID profil diperlukan",
      }, { status: 400 });
    }

    const cacheKey = `profile_views:${userId}:${profileId}`;
    const uniqueViewsKey = `profile_unique_total:${userId}:${profileId}`;

    const [viewsRaw, uniqueRaw] = await Promise.all([
      redis.get<string>(cacheKey),
      redis.get<string>(uniqueViewsKey),
    ]);

    const totalViews = parseInt(viewsRaw || "0", 10);
    const uniqueViews = parseInt(uniqueRaw || "0", 10);

    const response: ProfileViewsResponse = {
      success: true,
      data: {
        totalViews,
        uniqueViews,
        lastUpdated: new Date().toISOString(),
        cacheKey,
      },
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error fetching profile views:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal mengambil data",
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<ProfileViewsResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const profileId = searchParams.get("profileId");

    if (!userId || !profileId) {
      return NextResponse.json({
        success: false,
        error: "ID pengguna dan ID profil diperlukan",
      }, { status: 400 });
    }

    const cacheKey = `profile_views:${userId}:${profileId}`;
    const uniqueViewsKey = `profile_unique_total:${userId}:${profileId}`;

    await redis.del(cacheKey, uniqueViewsKey);

    return NextResponse.json({
      success: true,
      data: {
        totalViews: 0,
        uniqueViews: 0,
        lastUpdated: new Date().toISOString(),
        cacheKey,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting profile views:", error);
    
    return NextResponse.json({
      success: false,
      error: "Gagal memadamkan data",
    }, { status: 500 });
  }
}