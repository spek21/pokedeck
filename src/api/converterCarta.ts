import { CartaApi, CartaTcgdex, ImagensCartaApi, ResumoCartaTcgdex } from '../tipos/api';

// A TCGdex manda só o endereço-base da imagem: acrescenta qualidade e extensão
export function imagensDe(base?: string): ImagensCartaApi | undefined {
  if (!base) return undefined;
  return { small: `${base}/low.webp`, large: `${base}/high.webp` };
}

// Item da lista -> formato do app
export function daResumo(carta: ResumoCartaTcgdex): CartaApi {
  return { id: carta.id, name: carta.name, images: imagensDe(carta.image) };
}

// Detalhe -> formato do app
export function daDetalhe(carta: CartaTcgdex): CartaApi {
  return {
    id: carta.id,
    name: carta.name,
    supertype: carta.category,
    types: carta.types,
    rarity: carta.rarity,
    images: imagensDe(carta.image),
    set: { id: carta.set.id, name: carta.set.name },
  };
}
