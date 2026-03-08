import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all public communities
  const { data: communities, error } = await supabase
    .from("communities")
    .select("*")
    .eq("is_public", true)
    .order("member_count", { ascending: false });

  if (error) {
    console.error("Communities fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch communities", details: error.message },
      { status: 500 }
    );
  }

  // Fetch user's memberships
  const { data: memberships } = await supabase
    .from("community_members")
    .select("community_id")
    .eq("user_id", user.id);

  const memberCommunityIds = new Set(
    (memberships || []).map((m: { community_id: string }) => m.community_id)
  );

  // Also fetch private communities the user is a member of (not in public list)
  const privateCommunityIds = (memberships || [])
    .map((m: { community_id: string }) => m.community_id)
    .filter(
      (id: string) =>
        !communities?.some((c) => c.id === id)
    );

  let allCommunities = communities || [];

  if (privateCommunityIds.length > 0) {
    const { data: privateCommunities } = await supabase
      .from("communities")
      .select("*")
      .in("id", privateCommunityIds);

    if (privateCommunities) {
      allCommunities = [...allCommunities, ...privateCommunities];
    }
  }

  return NextResponse.json({
    communities: allCommunities,
    memberCommunityIds: Array.from(memberCommunityIds),
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, is_public } = body as {
    name: string;
    description: string;
    is_public: boolean;
  };

  if (!name || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Community name is required" },
      { status: 400 }
    );
  }

  if (name.trim().length > 50) {
    return NextResponse.json(
      { error: "Community name must be 50 characters or less" },
      { status: 400 }
    );
  }

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // Insert community
  const { data: community, error: communityError } = await supabase
    .from("communities")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      slug,
      created_by: user.id,
      member_count: 1,
      is_public: is_public ?? true,
    })
    .select()
    .single();

  if (communityError) {
    if (communityError.code === "23505") {
      return NextResponse.json(
        { error: "A community with that name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }

  // Add creator as owner
  const { error: memberError } = await supabase
    .from("community_members")
    .insert({
      community_id: community.id,
      user_id: user.id,
      role: "owner",
      joined_at: new Date().toISOString(),
    });

  if (memberError) {
    // Clean up the community if membership insert fails
    await supabase.from("communities").delete().eq("id", community.id);
    return NextResponse.json(
      { error: "Failed to create community" },
      { status: 500 }
    );
  }

  return NextResponse.json({ community });
}
