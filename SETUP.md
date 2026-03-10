# ⚡ SWAS Leads — Setup Completo

## Stack
- Next.js 14 + TypeScript
- Tailwind CSS dark premium
- **Apify** Google Maps Scraper (dados reais de negócios)
- **Perplexity API** (chat IA, opcional)
- Netlify deploy

---

## 1. Clone e instale

```bash
git clone https://github.com/pter0005/buscarleads
cd buscarleads
npm install
```

---

## 2. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas keys.

### 2.1 Apify Token (obrigatório)

1. Crie conta grátis em https://apify.com
2. Vá em **Console → Settings → Integrations**
3. Copie seu **API token** (começa com `apify_api_...`)
4. Cole em `APIFY_TOKEN=`

**Custo Apify:** ~$2.10 por 1.000 lugares. Com $5 de crédito grátis você testa bastante.

### 2.2 Perplexity API Key (opcional)

1. Acesse https://www.perplexity.ai/settings/api
2. Gere uma API Key
3. Cole em `PERPLEXITY_API_KEY=`

Sem ela o chat funciona com respostas estáticas inteligentes.

---

## 3. Rode local

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## 4. Deploy no Netlify

1. Conecte o repo `pter0005/buscarleads` no Netlify
2. Adicione as env vars no painel do Netlify:
   - `APIFY_TOKEN`
   - `PERPLEXITY_API_KEY` (opcional)
3. Build command: `npm run build`
4. Deploy!

---

## Como usar

### Via formulário
1. Digite o nicho (Barbearia, Salão, Restaurante...)
2. Digite a cidade
3. Clique Buscar Leads
4. Aguarde ~15-30s o Apify retornar os dados

### Via Chat IA (bolinha verde no canto)
1. Clique no ícone de chat
2. Escreva em linguagem natural:
   - "Quero cabeleireiros de mulher em Arujá"
   - "Buscar salões em Guarulhos"
   - "Restaurantes em Mogi das Cruzes"
3. O assistente detecta o nicho e cidade e dispara a busca automaticamente

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

Score mais alto = maior oportunidade para a NEW Agency fechar.
