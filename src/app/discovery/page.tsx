import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/server";
export const metadata = {
  title: "Discovery | Property Advice MVP",
  description: "Browse experts and published services.",
};

type Relation<T> = T | T[] | null;

function firstRelated<T>(relation: Relation<T>): T | null {
  if (!relation) return null;
  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
}

type ServiceRow = {
  id: string;
  title: string;
  description: string;
  price_label: string | null;
  booking_url: string | null;
  profiles: Relation<{
    id: string;
    display_name: string | null;
    expert_profiles: Relation<{
      level: string | null;
      area: string | null;
      bio: string | null;
    }>;
  }>;
};
type ExpertRow = {
  user_id: string;
  level: string | null;
  area: string | null;
  bio: string | null;
  profiles: Relation<{
    display_name: string | null;
  }>;
};
export default async function DiscoveryPage() {
  const [servicesRes, expertsRes] = await Promise.all([
    supabase
      .from("services")
      .select(
        `
        id,
        title,
        description,
        price_label,
        booking_url,
        profiles:expert_user_id (
          id,
          display_name,
          expert_profiles (
            level,
            area,
            bio
          )
        )
      `,
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("expert_profiles")
      .select(
        `
        user_id,
        level,
        area,
        bio,
        profiles:user_id (
          display_name
        )
      `,
      )
      .order("created_at", { ascending: false }),
  ]);
  if (servicesRes.error || expertsRes.error) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Discovery</h1>
        <p role="status" className="mt-4 text-sm text-red-600">
          We couldn’t load discovery data right now. Please try again.
        </p>
      </main>
    );
  }
  const services = (servicesRes.data ?? []) as ServiceRow[];
  const experts = (expertsRes.data ?? []) as ExpertRow[];
  return (
    <main className="mx-auto max-w-5xl space-y-10 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Discovery</h1>
        <p className="text-sm text-muted-foreground">
          Browse experts and their published services.
        </p>
      </header>
      <section aria-labelledby="experts-heading" className="space-y-4">
        <h2 id="experts-heading" className="text-xl font-medium">
          Experts
        </h2>
        {experts.length === 0 ? (
          <p>No experts available yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {experts.map((expert) => (
              <li key={expert.user_id}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {firstRelated(expert.profiles)?.display_name ??
                        "Unnamed expert"}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline">
                        {expert.level ?? "Level unavailable"}
                      </Badge>
                      <Badge variant="outline">
                        {expert.area ?? "Area unavailable"}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  {expert.bio ? (
                    <CardContent>
                      <p>{expert.bio}</p>
                    </CardContent>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-labelledby="services-heading" className="space-y-4">
        <h2 id="services-heading" className="text-xl font-medium">
          Services
        </h2>
        {services.length === 0 ? (
          <p>No services available yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <li key={service.id}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>
                      By{" "}
                      {firstRelated(service.profiles)?.display_name ??
                        "Unknown expert"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p>{service.description}</p>
                    {service.price_label ? (
                      <Badge variant="secondary">{service.price_label}</Badge>
                    ) : null}
                  </CardContent>
                  {service.booking_url ? (
                    <CardFooter>
                      <Button asChild size="sm" variant="outline">
                        <a
                          href={service.booking_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Book ${service.title} in a new tab`}
                        >
                          Book service
                        </a>
                      </Button>
                    </CardFooter>
                  ) : null}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
