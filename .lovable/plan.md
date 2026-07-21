## Goal

Create a `README.md` at the project root with both English and Korean sections describing the Echo diary correction app.

## Structure

Single file, English first then Korean (each with the same sections):

1. **Title & tagline** — Echo · "Write. Get corrected. See your patterns."
2. **Overview** — AI-powered multilingual diary that corrects writing (EN/KO), shows change tables with categories, sub-scores (Accuracy/Naturalness/Vocabulary/Structure), streaks, weekly goals, history heatmap, and periodic reports.
3. **Features** — Correction with editorial feedback, changes table, history search + 1-year heatmap, weekly goal + streak, reports, 6-language UI (en/ko/ja/zh/es/fr), auto-save drafts, mobile bottom nav.
4. **Tech stack** — TanStack Start v1, React 19, Vite 7, Tailwind v4, shadcn/ui, IndexedDB, Lovable AI Gateway, Cloudflare Workers runtime.
5. **Getting started** — `bun install`, `bun dev`, `bun run build`, `bun test`.
6. **Environment** — reference `.env.example` (AI gateway key etc.).
7. **Project structure** — brief tree of `src/routes`, `src/components`, `src/lib`, `src/hooks`.
8. **Scripts** — dev / build / build:dev / preview / lint / test / format.
9. **Deployment** — Lovable publish + portability note (see `MIGRATION.md`).
10. **License** — placeholder (private).

Korean section mirrors the English one, using the app's own translated terminology (작성/일자별 보기/레포트/설정, 교정, 변경표, 정확성/자연스러움/어휘/구조, 주간 목표, 연속 기록).

## Files

- `README.md` (create/overwrite)

No code changes.  
  
  


lovable 로 했다는건 빼줘