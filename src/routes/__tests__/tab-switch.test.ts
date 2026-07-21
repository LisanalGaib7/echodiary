/**
 * Smoke test: every tab in the sidebar has a matching route file whose
 * createFileRoute() is bound to the expected URL. Guards against the
 * "tab click doesn't change content" regression by ensuring the Nav
 * links and the route files stay in lockstep.
 *
 * Run with: bun test
 */
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = join(import.meta.dir, "..");

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
  const nav = readFileSync(
    join(ROUTES_DIR, "..", "components", "root", "Nav.tsx"),
    "utf8",
  );
  for (const c of cases) {
    expect(nav).toContain(`to="${c.path}"`);
  }
});
