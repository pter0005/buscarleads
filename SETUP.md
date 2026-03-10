# ⚡ SWAS Leads — Setup Completo

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS dark premium
- **Apify** Google Maps Scraper
- **Gemini 2.5 Pro** chat IA (grátis)
- Netlify deploy

---

## Rodar local

```bash
git clone https://github.com/pter0005/buscarleads
cd buscarleads
npm install
cp .env.local.example .env.local
# edite .env.local com suas keys
npm run dev
```

---

## Deploy no Netlify

### 1. Instala o plugin (rode uma vez no projeto)
```bash
npm install @netlify/plugin-nextjs
git add .
git commit -m "add netlify plugin"
git push
```

### 2. Conecta o repo no Netlify
- app.netlify.com → Add new site → Import an existing project
- Seleciona GitHub → pter0005/buscarleads

### 3. Adiciona as env vars no Netlify
Site settings → Environment variables → Add variable:

| Key | Onde pegar |
|---|---|
| `APIFY_TOKEN` | apify.com → Console → Settings → Integrations |
| `GEMINI_API_KEY` | aistudio.google.com/apikey |

### 4. Deploy
Clica em Deploy site — pronto!

---

## Como usar

### Via formulário
Digite nicho + cidade → Buscar Leads → aguarda ~15-30s

### Via Chat IA (bolinha verde)
Fale em linguagem natural:
- "Cabeleireiros de mulher em Arujá"
- "Restaurantes em Guarulhos"
- "Acadêmias em Mogi das Cruzes"

---

## Score SWAS

| Fator | Pontos |
|---|---|
| Sem site | +35 |
| Sem Instagram | +20 |
| IG amador | +12 |
| Sem identidade visual | +10 |
| Movimentado sem site | +18 |
| Alta avaliação sem presença | +10 |
| Difícil de contatar | +5 |
