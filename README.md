# Health Dashboard — Mobile (Expo + React Native)

App Expo (SDK 54) em TypeScript com NativeWind, Axios e estrutura em `src/` (components, screens, services, hooks, theme, utils). Fluxo: onboarding (3 slides) → login/cadastro → dashboard com cartões de biomarcadores, botão flutuante “+” (modal) e bloco destacado para recomendações da IA.

## Links (produção — Render)

- **Web App (Front):** [https://health-dashboard-tecsagroup-front.onrender.com](https://health-dashboard-tecsagroup-front.onrender.com)
- **API (Back):** [https://health-dashboard-tecsagroup-back.onrender.com](https://health-dashboard-tecsagroup-back.onrender.com) — base das chamadas Axios em produção: **`https://health-dashboard-tecsagroup-back.onrender.com/api`** (`EXPO_PUBLIC_API_URL` no build estático).

## Requisitos

- Node.js **20.19.4+** recomendado (o template Expo 54 avisa se estiver abaixo).
- Backend Laravel rodando (padrão `http://127.0.0.1:8000/api`).

## Variáveis de ambiente

```bash
cp .env.example .env
```

- **Emulador Android:** use `http://10.0.2.2:8000/api` em `EXPO_PUBLIC_API_URL`.
- **Simulador iOS / web:** `http://127.0.0.1:8000/api` ou o IP da sua máquina na rede.
- **Produção (Render / domínio público):** defina `EXPO_PUBLIC_API_URL` com a URL **HTTPS** do backend **incluindo** o sufixo `/api`, por exemplo `https://seu-backend.onrender.com/api` (valor é embutido no bundle no momento do **`npm run export:web`**).

## Suporte à Web

O projeto já usa **`react-dom`** e **`react-native-web`**. Para alinhar com o Expo SDK 54 há também **`@expo/metro-runtime`** (instalado com `expo install`).

Gerar pasta estática para hospedar no navegador (Expo 54 usa **`dist`**, não mais `web-build`):

```bash
npm ci
npm run export:web
```

Confira se aparece **`dist/`** com `index.html` e `_expo/`.

## Deploy no Render (Static Site)

No painel Render: **New +** → **Static Site**. No monorepo, defina **Root Directory** = `health_dashboard_tecsagroup_front`.

| Campo | Valor |
|--------|--------|
| **Build Command** | `npm ci && npm run export:web` |
| **Publish directory** | `dist` |
| **Environment** | `NODE_VERSION` = `20.19.4` (ou `22.x`); `EXPO_PUBLIC_API_URL` = URL pública do Laravel com `/api` |

**Roteamento (SPA):** o app usa navegação no cliente. No serviço estático, abra **Redirects / Rewrites** e adicione uma regra **Rewrite**: origem `/*` → destino `/index.html` → **Rewrite** (ou equivalente na UI), para refreshes diretos não retornarem 404. Opcionalmente o build copia também `public/_redirects` (formato tipo Netlify) para `dist/`, caso a hospedagem a utilize.

## Comandos

```bash
npm install
npm run start
```

## API

O cliente Axios (`src/services/api/http.ts`) espelha as rotas do backend: `/register`, `/login`, `/dashboard`, `/biomarkers`. Tipos compartilhados estão em `src/services/api/types.ts`.

## UI

Paleta “clean health” (azul marinho, céu, menta) definida no `tailwind.config.js` e reutilizável em `src/theme/colors.ts`.

## Relatório de IA

O relatório consolidado—ferramentas utilizadas (Cursor: Composer, Agent, chat), contribuição no **front** (Expo, telas, API client, UX Web como calendário do filtro por dia) e papel da revisão humana—está no **[README na raiz do monorepo](../README.md)** (`Relatório de IA`).
