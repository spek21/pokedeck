import { CartaColecao } from './app';

// Modos de exibição da coleção
export type Agrupamento = 'tipo' | 'nome' | 'simples';

// Seção da SectionList (o campo "data" é o nome exigido pela lista)
export interface SecaoCartas {
  titulo: string;
  cor: string;
  copias: number;
  data: CartaColecao[];
}
