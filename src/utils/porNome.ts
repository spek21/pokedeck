import { SecaoCartas } from '../tipos/colecao';
import { CartaColecao } from '../tipos/app';
import { somarCopias } from './formatacao';

const corNeutra = '#475569';

// Minúsculas e sem acento: "Pikáchu" e "pikachu" ficam iguais
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Filtra pelo nome na própria coleção (sem chamar a API)
export function filtrarPorNome(cartas: CartaColecao[], filtro: string): CartaColecao[] {
  const alvo = normalizar(filtro);
  if (alvo === '') return cartas;
  return cartas.filter((carta) => normalizar(carta.nome).includes(alvo));
}

// Ordem alfabética (cria uma cópia, não altera a original)
export function ordenarPorNome(cartas: CartaColecao[]): CartaColecao[] {
  return [...cartas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

// Uma seção por Pokémon, com o total de cópias no cabeçalho
export function agruparPorNome(cartas: CartaColecao[]): SecaoCartas[] {
  const mapa = new Map<string, CartaColecao[]>();
  for (const carta of ordenarPorNome(cartas)) {
    const grupo = mapa.get(carta.nome) ?? [];
    grupo.push(carta);
    mapa.set(carta.nome, grupo);
  }

  return Array.from(mapa.entries()).map(([nome, grupo]) => ({
    titulo: nome,
    cor: corNeutra,
    copias: somarCopias(grupo),
    data: grupo,
  }));
}
