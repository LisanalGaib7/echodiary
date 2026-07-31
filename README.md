# Echo

Bilingual (EN/KO) diary app that corrects your entry in the language you wrote it — no translation, native-level grammar and phrasing feedback instead.

**Live**: https://echodiary-eng.vercel.app

English | [한국어](#echo-한국어)

![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## Demo

_Demo assets coming soon._

<!-- TODO(demo): hero — Write page with a fresh correction
     ![Echo correction view](docs/demo-correction.png) -->

<!-- TODO(demo): core loop GIF — writing an entry, getting corrected, saving a phrase
     ![Echo core loop](docs/demo-loop.gif) -->

<!-- TODO(demo): mobile screen
     ![Echo mobile](docs/demo-mobile.png) -->

## Features

- Write a diary entry in English or Korean — get it corrected within that same language, not translated
- A per-change table: category, severity, and the reason behind each correction
- Four sub-scores per entry: Accuracy, Naturalness, Vocabulary, Structure
- Streaks, a weekly goal, and a 1-year activity heatmap over past entries
- Saved: drag-select any phrase from a correction to build a personal vocabulary list
- Reports of the errors you make most often
- UI in English, Korean, Japanese, Chinese, Spanish, or French; the diary itself stays in whichever language you wrote it

## How it works

Entries live in **IndexedDB**, entirely in your browser — there is no server-side database, so nothing you write is stored remotely. The only thing that touches a server is the correction call itself, a stateless request to an AI gateway that returns the corrected text and never persists it.

## Tech Stack

- TanStack Start v1, React 19, Vite 7
- Tailwind CSS v4, shadcn/ui, Fraunces + Inter
- IndexedDB (client-side entry storage)
- Server-side AI gateway (OpenAI-compatible — OpenAI / OpenRouter / Gemini, swappable via one env var)
- Deployed on Vercel

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env` and fill in the AI gateway credentials:

| Variable | Description |
| --- | --- |
| `AI_PROVIDER` | One of `openai` / `openrouter` / `gemini` |
| `OPENAI_API_KEY` / `OPENROUTER_API_KEY` / `GEMINI_API_KEY` | Key for whichever provider you selected |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to call the AI server function. Leave empty in local dev |
| `TURNSTILE_SECRET` / `VITE_TURNSTILE_SITE_KEY` | Optional — Cloudflare Turnstile bot protection |

### 2. Install and run

```bash
bun install
bun dev
```

The dev server runs at **http://localhost:8080**.

## Deployment

Push to `main` and Vercel deploys automatically. **Environment variable changes require a manual Redeploy** in the Vercel dashboard — they aren't picked up by existing deployments.

---

# Echo (한국어)

한국어·영어 일기를 쓰면, 번역이 아니라 **쓴 언어 그대로** 원어민 수준으로 교정해주는 앱.

**라이브**: https://echodiary-eng.vercel.app

[English](#echo) | 한국어

## 데모

_데모 이미지 준비 중입니다._

## 주요 기능

- 영어 또는 한국어로 일기 작성 — 번역 없이 그 언어 안에서 교정
- 카테고리·심각도·이유가 담긴 변경표
- 네 가지 세부 점수: 정확성, 자연스러움, 어휘, 구조
- 연속 작성 기록(스트릭), 주간 목표, 지난 1년 활동 히트맵
- Saved: 교정 결과에서 마음에 드는 표현을 드래그 선택해 나만의 단어장으로 저장
- 자주 반복되는 오류를 모아 보여주는 리포트
- UI는 영어·한국어·일본어·중국어·스페인어·프랑스어 지원, 일기 본문은 쓴 언어 그대로 유지

## 동작 방식

일기 데이터는 **IndexedDB**, 즉 브라우저 안에만 저장됩니다 — 서버 DB 자체가 없어서 작성한 내용이 원격으로 전송되지 않습니다. 서버를 타는 건 교정 요청 하나뿐이며, 교정된 텍스트를 반환할 뿐 어디에도 저장하지 않는 상태 없는(stateless) 요청입니다.

## 기술 스택

- TanStack Start v1, React 19, Vite 7
- Tailwind CSS v4, shadcn/ui, Fraunces + Inter
- IndexedDB (일기 로컬 저장)
- 서버 사이드 AI 게이트웨이 (OpenAI 호환 — OpenAI/OpenRouter/Gemini, env 하나로 교체 가능)
- Vercel 배포

## 시작하기

### 1. 환경변수

`.env.example`을 `.env`로 복사한 뒤 AI 게이트웨이 값을 채운다:

| 변수 | 설명 |
| --- | --- |
| `AI_PROVIDER` | `openai` / `openrouter` / `gemini` 중 하나 |
| `OPENAI_API_KEY` / `OPENROUTER_API_KEY` / `GEMINI_API_KEY` | 선택한 프로바이더의 키 |
| `ALLOWED_ORIGINS` | AI 서버 함수 호출을 허용할 origin, 콤마 구분. 로컬 개발 시 비워둠 |
| `TURNSTILE_SECRET` / `VITE_TURNSTILE_SITE_KEY` | 선택 — Cloudflare Turnstile 봇 방지 |

### 2. 설치 및 실행

```bash
bun install
bun dev
```

개발 서버는 **http://localhost:8080** 에서 실행됩니다.

## 배포

`main`에 push하면 Vercel이 자동 배포합니다. **환경변수를 바꾼 경우엔 Vercel 대시보드에서 수동 Redeploy가 필요합니다** — 기존 배포에 자동 반영되지 않습니다.

---

Source is public for portfolio purposes. All rights reserved — not licensed for reuse.
소스는 포트폴리오 목적으로 공개돼 있습니다. 모든 권리 보유 — 재사용을 허가하지 않습니다.
