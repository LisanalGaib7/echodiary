import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import scrollbarCss from "../index.css?url";
import { UiLangProvider } from "@/lib/ui-lang";
import { ExplainLangProvider } from "@/lib/explain-lang";
import { EditorTypeProvider } from "@/lib/editor-type";
import { RootShell } from "@/components/root/RootShell";
import { Nav } from "@/components/root/Nav";
import { NotFound } from "@/components/root/NotFound";
import { RootError } from "@/components/root/RootError";
import { WeeklyGoal as WeeklySidebar } from "@/components/WeeklyGoal";
import { MobileHeader } from "@/components/root/MobileHeader";
import { MobileTabBar } from "@/components/root/MobileTabBar";
import { FeedbackFab } from "@/components/root/FeedbackFab";

const SITE_URL = "https://echodiary-eng.vercel.app";
const SITE_TITLE = "Echo — Bilingual diary correction";
const SITE_DESCRIPTION =
  "Write a diary in English or Korean and get native-level corrections, scores, and pattern reports.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "echodiary" },
      { property: "og:image", content: `${SITE_URL}/og.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "echodiary corrects your diary in the language you wrote it — English or Korean.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/og.png` },
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
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
        <ExplainLangProvider>
          <EditorTypeProvider>
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
              <FeedbackFab />
            </div>
          </EditorTypeProvider>
        </ExplainLangProvider>
      </UiLangProvider>
    </QueryClientProvider>
  );
}
