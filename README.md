# Health Dashboard — Mobile (Expo + React Native)

App Expo (SDK 54) em TypeScript com NativeWind, Axios e estrutura em `src/` (components, screens, services, hooks, theme, utils). Fluxo: onboarding (3 slides) → login/cadastro → dashboard com cartões de biomarcadores, botão flutuante “+” (modal) e bloco destacado para recomendações da IA.

## Requisitos

- Node.js **20.19.4+** recomendado (o template Expo 54 avisa se estiver abaixo).
- Backend Laravel rodando (padrão `http://127.0.0.1:8000/api`).

## Variáveis de ambiente

```bash
cp .env.example .env
```

- **Emulador Android:** use `http://10.0.2.2:8000/api` em `EXPO_PUBLIC_API_URL`.
- **Simulador iOS / web:** `http://127.0.0.1:8000/api` ou o IP da sua máquina na rede.

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
