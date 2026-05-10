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
- **Produção (Render / domínio público):** defina `EXPO_PUBLIC_API_URL` como a origem **HTTPS** do Laravel, por exemplo `https://health-dashboard-tecsagroup-back.onrender.com` — o código **acrescenta `/api` automaticamente** se você não colocar (evita cadastro indo para `/register` em vez de `/api/register`). Pode também informar já com `/api` no final. O valor é embutido no bundle no **`npm run export:web`**.

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
| **Build Command** | `npm ci && npm run export:web` (equivalente: `npx expo export -p web --output-dir dist`) |
| **Publish directory** | `dist` |
| **Environment** | `NODE_VERSION` = `20.19.4` (ou `22.x`); `EXPO_PUBLIC_API_URL` = `https://SEU-BACK.onrender.com` (com ou sem `/api`) |

**Roteamento (SPA):** o app usa navegação no cliente. No serviço estático, abra **Redirects / Rewrites** e adicione uma regra **Rewrite**: origem `/*` → destino `/index.html` → **Rewrite** (ou equivalente na UI), para refreshes diretos não retornarem 404. Opcionalmente o build copia também `public/_redirects` (formato tipo Netlify) para `dist/`, caso a hospedagem a utilize.

### Chamada ao backend

O Axios usa **`EXPO_PUBLIC_API_URL`** normalizada em `src/services/api/http.ts` (se faltar `/api` no final, é adicionado). Ex.: `EXPO_PUBLIC_API_URL=https://health-dashboard-tecsagroup-back.onrender.com` → chamadas vão para `…/api/register`, etc.

### Testar no navegador (Chrome)

1. Abra o front em produção e **F12** → aba **Network**.
2. Tente **Cadastrar** e localize a requisição para `…/api/register`.
3. **404** → `EXPO_PUBLIC_API_URL` errada ou faltando `/api` no path.
4. **CORS / bloqueado** → no Laravel, defina `CORS_ALLOWED_ORIGINS` com a origem exata do front (`config/cors.php`; ver README do backend).
5. **Para localhost / falha de rede** → o bundle ainda foi gerado sem `EXPO_PUBLIC_API_URL` no Render; ajuste a env do Static Site e faça **novo deploy**.

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
