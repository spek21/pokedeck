// Interfaces do que a API TCGdex devolve (separadas das do app)

// Item da lista: GET /{idioma}/cards?name=...
export interface ResumoCartaTcgdex {
  id: string;
  localId: string | number;
  name: string;
  image?: string; // endereço-base: faltam a qualidade e a extensão
}

export interface EdicaoTcgdex {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
}

// Detalhe: GET /{idioma}/cards/{id}
export interface CartaTcgdex {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
  category: string; // "Pokemon", "Trainer" ou "Energy"
  rarity?: string;
  types?: string[];
  set: EdicaoTcgdex;
}

// Formato interno usado pelas telas (convertido a partir da TCGdex)
export interface ImagensCartaApi {
  small: string;
  large: string;
}

export interface EdicaoCartaApi {
  id: string;
  name: string;
  series?: string;
}

export interface CartaApi {
  id: string;
  name: string;
  supertype?: string; // a lista da API não traz; só o detalhe
  types?: string[];
  rarity?: string;
  images?: ImagensCartaApi;
  set?: EdicaoCartaApi;
}
