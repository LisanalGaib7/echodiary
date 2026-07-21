import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import scrollbarCss from "../index.css?url";
import { UiLangProvider } from "@/lib/ui-lang";
import { RootShell } from "@/components/root/RootShell";
import { Nav } from "@/components/root/Nav";
import { NotFound } from "@/components/root/NotFound";
import { RootError } from "@/components/root/RootError";
import { WeeklyGoal as WeeklySidebar } from "@/components/WeeklyGoal";
import { MobileHeader } from "@/components/root/MobileHeader";
import { MobileTabBar } from "@/components/root/MobileTabBar";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Echo — Bilingual diary correction" },
      {
        name: "description",
        content:
          "Write a diary in English or Korean and get native-level corrections, scores, and pattern reports.",
      },
      { property: "og:title", content: "Echo — Bilingual diary correction" },
      { name: "twitter:title", content: "Echo — Bilingual diary correction" },
      {
        property: "og:description",
        content:
          "Write a diary in English or Korean and get native-level corrections, scores, and pattern reports.",
      },
      {
        name: "twitter:description",
        content:
          "Write a diary in English or Korean and get native-level corrections, scores, and pattern reports.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ddd336-1069-4821-af1f-34d28c82fc11/id-preview-fef39d7c--e097aac5-294b-43f2-b651-6f38c5cb2375.lovable.app-1781788594422.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c2ddd336-1069-4821-af1f-34d28c82fc11/id-preview-fef39d7c--e097aac5-294b-43f2-b651-6f38c5cb2375.lovable.app-1781788594422.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: scrollbarCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const to of ["/", "/history", "/report", "/settings"] as const) {
        void router.preloadRoute({ to }).catch(() => {
          // Ignore speculative preload failures; direct navigation will retry.
        });
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <UiLangProvider>
        <div className="min-h-screen">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-6 md:grid-cols-12 md:gap-16 md:py-16">
            <aside className="hidden md:sticky md:top-16 md:col-span-3 md:block md:self-start">
              <Nav />
              <div className="mt-12">
                <WeeklySidebar />
              </div>
            </aside>
            <main className="min-w-0 pb-24 md:col-span-9 md:pb-0">
              <MobileHeader />
              <Outlet />
            </main>
          </div>
          <MobileTabBar />
        </div>
      </UiLangProvider>
    </QueryClientProvider>
  );
}
