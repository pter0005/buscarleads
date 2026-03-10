# ⚡ SWAS Leads — Inteligência Comercial Local

Plataforma de prospecção inteligente para negócios locais. Identifica empresas com alta demanda mas presença digital fraca.

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS (dark premium)
- Lucide Icons
- Framer Motion

## Rodar local

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  app/          # Rotas Next.js
  components/   # Componentes reutilizáveis
  lib/          # Score, utils, mock data
  types/        # TypeScript types
```

## Score SWAS

| Fator | Peso |
|---|---|
| Sem site | +35 |
| Sem Instagram | +20 |
| IG amador | +12 |
| Sem identidade visual | +15 |
| Movimentado sem site | +18 |
| Alta avaliação sem presença | +10 |

Score mais alto = maior oportunidade comercial.
