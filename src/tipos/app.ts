// Interfaces do app (separadas das da API)
export const condicoes = ['Nova', 'Quase nova', 'Usada', 'Danificada'] as const;
export type CondicaoCarta = (typeof condicoes)[number];

// Carta guardada na coleção do treinador
export interface CartaColecao {
  id: string; // mesmo id da API: uma entrada por carta
  nome: string;
  supertype: string;
  tipos: string[];
  raridade: string | null;
  edicao: string | null;
  imagemPequena: string | null;
  imagemGrande: string | null;
  quantidade: number;
  condicao: CondicaoCarta;
  preco: number | null;
  anotacoes: string;
  ativa: boolean; // false = excluída de forma lógica
  criadaEm: string;
  atualizadaEm: string;
}

// Estado do formulário: tudo texto, como vem dos campos
export interface DadosCarta {
  quantidade: string;
  condicao: CondicaoCarta;
  preco: string;
  anotacoes: string;
}

// Valores já validados e convertidos
export interface ValoresCarta {
  quantidade: number;
  condicao: CondicaoCarta;
  preco: number | null;
  anotacoes: string;
}

// Mensagens de erro por campo (campo ausente = sem erro)
export interface ErrosCarta {
  quantidade?: string;
  preco?: string;
}

export const dadosIniciaisCarta: DadosCarta = {
  quantidade: '1',
  condicao: 'Nova',
  preco: '',
  anotacoes: '',
};
