/**
 * Simple smoke test: every tab in the sidebar has a matching route module
 * that exports a `Route` bound to the expected path. Guards against the
 * "tab click doesn't change content" regression by ensuring each route
 * is wired at the exact path the Nav links to.
 *
 * Run with: bun test
 */
import { expect, test } from "bun:test";

import { Route as IndexRoute } from "../index";
import { Route as HistoryRoute } from "../history";
import { Route as ReportRoute } from "../report";
import { Route as SettingsRoute } from "../settings";

const cases = [
  { name: "write", route: IndexRoute, path: "/" },
  { name: "history", route: HistoryRoute, path: "/history" },
  { name: "report", route: ReportRoute, path: "/report" },
  { name: "settings", route: SettingsRoute, path: "/settings" },
];

for (const c of cases) {
  test(`tab '${c.name}' maps to ${c.path}`, () => {
    // TanStack Router stores the declared path on the route options.
    // Access via `any` to avoid depending on internal types.
    const path = (c.route as any).options?.path ?? (c.route as any).path;
    expect(path).toBe(c.path);
  });
}
