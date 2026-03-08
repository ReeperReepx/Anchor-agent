"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Community } from "@/lib/types/database";

export default function CommunityPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [myCommunities, setMyCommunities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const fetchCommunities = useCallback(async () => {
    try {
      const res = await fetch("/api/communities");
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Failed to load communities");
      setCommunities(data.communities || []);
      setMyCommunities(new Set(data.memberCommunityIds || []));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load communities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          description: createForm.description,
          is_public: createForm.isPublic,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create community");
      }

      setCreateForm({ name: "", description: "", isPublic: true });
      setShowCreate(false);
      await fetchCommunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin(communityId: string) {
    setActionLoading(communityId);
    setError(null);

    try {
      const res = await fetch("/api/communities/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community_id: communityId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to join community");
      }

      await fetchCommunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLeave(communityId: string) {
    if (!window.confirm("Leave this community?")) return;
    setActionLoading(communityId);
    setError(null);

    try {
      const res = await fetch("/api/communities/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ community_id: communityId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to leave community");
      }

      await fetchCommunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-7 w-48" />
        <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-[28px]">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4" />
        </div>
        <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-[28px]">
          <div className="skeleton h-4 w-32 mb-4" />
          <div className="skeleton h-3 w-full mb-3" />
          <div className="skeleton h-3 w-3/4" />
        </div>
      </div>
    );
  }

  const myCommunitiesList = communities.filter((c) => myCommunities.has(c.id));
  const discoverList = communities.filter((c) => !myCommunities.has(c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-semibold text-[#1D1D1F] tracking-[-0.02em]">
          Communities
        </h1>
        <Button onClick={() => setShowCreate(true)} size="sm">
          Create Community
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[16px] text-red-600">
          {error}
        </div>
      )}

      {/* Create Community Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4">
            <Card className="!p-6 sm:!p-8">
              <CardHeader>
                <CardTitle>Create a community</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-[16px] font-medium text-[#1D1D1F] mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g. Indie Hackers NYC"
                      maxLength={50}
                      className="w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-[16px] text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-medium text-[#1D1D1F] mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What's this community about?"
                      rows={3}
                      className="w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-[16px] text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-[16px] font-medium text-[#1D1D1F]">
                      Public community
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setCreateForm((f) => ({
                          ...f,
                          isPublic: !f.isPublic,
                        }))
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        createForm.isPublic ? "bg-accent" : "bg-[#E5E5E5]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          createForm.isPublic
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[14px] text-[#9CA3AF]">
                    {createForm.isPublic
                      ? "Anyone can find and join this community."
                      : "Only people with the link can join."}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowCreate(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!createForm.name.trim() || creating}
                      loading={creating}
                      className="flex-1"
                    >
                      {creating ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* My Communities */}
      {myCommunitiesList.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-[16px] font-semibold text-[#86868B] uppercase tracking-wider">
            My Communities
          </h2>
          <div className="grid gap-3">
            {myCommunitiesList.map((community) => (
              <Card key={community.id}>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[18px] font-semibold text-[#1D1D1F] truncate">
                          {community.name}
                        </h3>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[rgba(181,115,8,0.08)] px-2.5 py-0.5 text-[13px] font-medium text-accent">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {community.member_count}
                        </span>
                      </div>
                      {community.description && (
                        <p className="text-sm text-[#86868B] line-clamp-2">
                          {community.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleLeave(community.id)}
                      disabled={actionLoading === community.id}
                      className="shrink-0 text-[13px] font-medium text-[#9CA3AF] hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === community.id ? "Leaving..." : "Leave"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Discover */}
      <div className="space-y-3">
        <h2 className="text-[16px] font-semibold text-[#86868B] uppercase tracking-wider">
          Discover
        </h2>
        {discoverList.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-[rgba(255,149,0,0.08)] border border-[rgba(255,149,0,0.15)] rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(255,149,0,0.08)]">
                <svg
                  className="w-7 h-7 text-[#FF9500]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
              </div>
              <h2 className="text-[18px] font-semibold text-[#1D1D1F] mb-2">
                No communities to discover yet
              </h2>
              <p className="text-sm text-[#86868B] max-w-sm mx-auto">
                Be the first to create a community and connect with other
                solopreneurs.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {discoverList.map((community) => (
              <Card key={community.id}>
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[18px] font-semibold text-[#1D1D1F] truncate">
                          {community.name}
                        </h3>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#F5F5F7] px-2.5 py-0.5 text-[11px] font-medium text-[#86868B]">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {community.member_count}
                        </span>
                      </div>
                      {community.description && (
                        <p className="text-sm text-[#86868B] line-clamp-2">
                          {community.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleJoin(community.id)}
                      disabled={actionLoading === community.id}
                      loading={actionLoading === community.id}
                      className="shrink-0 !border-[#FF9500] !text-[#FF9500] hover:!bg-[rgba(255,149,0,0.06)]"
                    >
                      {actionLoading === community.id ? "Joining..." : "Join"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
