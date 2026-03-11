import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import type { ProductType } from "@/lib/types/database";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch product type
  const { data: profile } = await supabase
    .from("users")
    .select("product_type")
    .eq("id", user.id)
    .single<{ product_type: ProductType }>();

  const productType: ProductType = profile?.product_type ?? "standup";

  return (
    <AppShell user={user} productType={productType}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AppShell>
  );
}
