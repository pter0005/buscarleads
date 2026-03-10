# ⚡ SWAS Leads — Setup Completo

## 1. Clone e instale

```bash
git clone https://github.com/pter0005/buscarleads
cd buscarleads
npm install
```

## 2. Configure a API Key do Google

### Passo a passo:
1. Acesse https://console.cloud.google.com
2. Crie um projeto novo (ex: "swas-leads")
3. Vá em **APIs & Services > Library**
4. Ative as APIs:
   - ✅ **Places API (New)**
   - ✅ **Geocoding API**
5. Vá em **APIs & Services > Credentials**
6. Clique em **Create Credentials > API Key**
7. Copie a key

### Configure no projeto:
```bash
cp .env.local.example .env.local
```
Abra `.env.local` e cole sua key:
```
GOOGLE_PLACES_API_KEY=AIzaSy...
```

## 3. Rode o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## 4. Como usar

1. Digite o nicho (ex: Barbearia, Restaurante, Academia)
2. Digite a cidade (ex: Arujá, Guarulhos, São Paulo)
3. Clique em **Buscar Leads**
4. Veja os leads com score SWAS calculado automaticamente
5. Clique em qualquer lead para ver detalhes + abordagem WhatsApp
6. Exporte os leads filtrados em CSV

## 5. Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Na Vercel, adicione a variável de ambiente:
- `GOOGLE_PLACES_API_KEY` = sua key

## Nichos suportados

Barbearia, Salão, Restaurante, Pizzaria, Academia, Pet, Farmácia,
Dentista, Mecânica, Padaria, Estética, Hotel, Escola, Advogado,
Contabilidade, Imobiliária, Spa e qualquer termo em português.
