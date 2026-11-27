// Único lugar com endereço e rotas da API (TCGdex, gratuita e sem chave). Valores vêm do .env.
const urlPadrao = 'https://api.tcgdex.net/v2';
const idiomaPadrao = 'en'; // idioma dos nomes das cartas (en, pt, fr...)

const idioma = process.env.EXPO_PUBLIC_TCGDEX_LANG || idiomaPadrao;

export const config = {
  urlBase: process.env.EXPO_PUBLIC_TCGDEX_API_URL || urlPadrao,
  idioma,
} as const;

export const rotas = {
  cartas: `/${idioma}/cards`,
  carta: (id: string): string => `/${idioma}/cards/${encodeURIComponent(id)}`,
} as const;
