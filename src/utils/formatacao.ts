import { CartaColecao, DadosCarta } from '../tipos/app';

// Texto do total: "1 carta" ou "N cartas"
export function textoTotalCartas(total: number): string {
  return total === 1 ? '1 carta' : `${total} cartas`;
}

// Texto de cópias: "1 cópia" ou "N cópias"
export function textoCopias(total: number): string {
  return total === 1 ? '1 cópia' : `${total} cópias`;
}

// Tipos da carta em texto: "Fire, Dragon" ou "Sem tipo"
export function textoTipos(tipos?: string[]): string {
  return tipos && tipos.length > 0 ? tipos.join(', ') : 'Sem tipo';
}

// Total de cópias: soma as quantidades de todas as cartas da lista
export function somarCopias(cartas: CartaColecao[]): number {
  return cartas.reduce((total, carta) => total + carta.quantidade, 0);
}

// Preço em reais: 12.5 vira "R$ 12,50"; null vira "Sem preço"
export function formatarPreco(preco: number | null): string {
  if (preco === null) return 'Sem preço';
  return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

// Carta guardada -> textos do formulário (usado na edição)
export function daCartaParaDados(carta: CartaColecao): DadosCarta {
  return {
    quantidade: String(carta.quantidade),
    condicao: carta.condicao,
    preco: carta.preco === null ? '' : String(carta.preco).replace('.', ','),
    anotacoes: carta.anotacoes,
  };
}
