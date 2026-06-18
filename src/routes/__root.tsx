import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { UiLangProvider, useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found</p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Echo — Bilingual diary correction" },
      { name: "description", content: "Write a diary in English or Korean and get native-level corrections, scores, and pattern reports." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Nav() {
  const { uiLang, setUiLang } = useUiLang();
  const linkCls = "px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-muted";
  const activeCls = "bg-secondary text-foreground font-medium";
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-semibold tracking-tight text-primary">Echo</span>
          <TypewriterTagline text={t("tagline", uiLang)} className="hidden text-xs text-muted-foreground sm:inline" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" activeOptions={{ exact: true }} className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>{t("navWrite", uiLang)}</Link>
          <Link to="/history" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>{t("navHistory", uiLang)}</Link>
          <Link to="/report" className={linkCls} activeProps={{ className: `${linkCls} ${activeCls}` }}>{t("navReport", uiLang)}</Link>
          <div className="ml-2 flex overflow-hidden rounded-md border border-border text-xs">
            <button onClick={() => setUiLang("en")} className={`px-2.5 py-1 ${uiLang === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>EN</button>
            <button onClick={() => setUiLang("ko")} className={`px-2.5 py-1 ${uiLang === "ko" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>KO</button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <UiLangProvider>
        <div className="min-h-screen">
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-8"><Outlet /></main>
        </div>
      </UiLangProvider>
    </QueryClientProvider>
  );
}
