/**
 * Smoke test: every tab in the sidebar has a matching route file whose
 * createFileRoute() is bound to the expected URL. Guards against the
 * "tab click doesn't change content" regression by ensuring Nav links
 * and route files stay in lockstep.
 *
 * Run with: bun test
 */
// @ts-expect-error - bun:test is provided by the Bun runtime
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTES_DIR = join(HERE, "..");

const cases: { name: string; file: string; path: string }[] = [
  { name: "write", file: "index.tsx", path: "/" },
  { name: "history", file: "history.tsx", path: "/history" },
  { name: "report", file: "report.tsx", path: "/report" },
  { name: "settings", file: "settings.tsx", path: "/settings" },
];

for (const c of cases) {
  test(`tab '${c.name}' route file declares ${c.path}`, () => {
    const src = readFileSync(join(ROUTES_DIR, c.file), "utf8");
    expect(src).toContain(`createFileRoute("${c.path}")`);
  });
}

test("sidebar Nav links to every tab", () => {
  const nav = readFileSync(join(ROUTES_DIR, "..", "components", "root", "Nav.tsx"), "utf8");
  for (const c of cases) {
    expect(nav).toContain(`to="${c.path}"`);
  }
});

test("router and tab links preload route chunks on intent", () => {
  const router = readFileSync(join(ROUTES_DIR, "..", "router.tsx"), "utf8");
  const nav = readFileSync(join(ROUTES_DIR, "..", "components", "root", "Nav.tsx"), "utf8");
  const mobileTabBar = readFileSync(
    join(ROUTES_DIR, "..", "components", "root", "MobileTabBar.tsx"),
    "utf8",
  );

  expect(router).toContain('defaultPreload: "intent"');
  for (const c of cases) {
    expect(nav).toContain(`to="${c.path}"`);
    expect(mobileTabBar).toContain(`to="${c.path}"`);
  }
  expect(nav.match(/preload="intent"/g)?.length).toBeGreaterThanOrEqual(cases.length);
  expect(mobileTabBar.match(/preload="intent"/g)?.length).toBeGreaterThanOrEqual(cases.length);
});
