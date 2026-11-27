import { SecaoCartas } from '../tipos/colecao';
import { CartaColecao } from '../tipos/app';
import { somarCopias } from './formatacao';
import { ordenarPorNome } from './porNome';

export const tipoOutros = 'Outros';

// Ordem das seções e cor de cada tipo
export const tiposDaLista = [
  'Fire',
  'Water',
  'Grass',
  'Lightning',
  'Psychic',
  'Fighting',
  'Darkness',
  'Metal',
  'Dragon',
  'Fairy',
  'Colorless',
] as const;

const corPorTipo: Record<string, string> = {
  Fire: '#ea580c',
  Water: '#2563eb',
  Grass: '#16a34a',
  Lightning: '#ca8a04',
  Psychic: '#9333ea',
  Fighting: '#b45309',
  Darkness: '#1f2937',
  Metal: '#64748b',
  Dragon: '#4f46e5',
  Fairy: '#db2777',
  Colorless: '#78716c',
  Outros: '#475569',
};

// Primeiro tipo da carta; sem tipo ou fora da lista vira "Outros"
export function tipoDaCarta(carta: CartaColecao): string {
  const primeiro = carta.tipos[0];
  if (primeiro === undefined) return tipoOutros;
  return (tiposDaLista as readonly string[]).includes(primeiro) ? primeiro : tipoOutros;
}

// Agrupa por tipo, na ordem da lista, e esconde seções vazias
export function agruparPorTipo(cartas: CartaColecao[]): SecaoCartas[] {
  const ordem: string[] = [...tiposDaLista, tipoOutros];

  return ordem
    .map((tipo) => {
      const grupo = ordenarPorNome(cartas.filter((carta) => tipoDaCarta(carta) === tipo));
      return {
        titulo: tipo,
        cor: corPorTipo[tipo] ?? corPorTipo[tipoOutros],
        copias: somarCopias(grupo),
        data: grupo,
      };
    })
    .filter((secao) => secao.data.length > 0);
}
