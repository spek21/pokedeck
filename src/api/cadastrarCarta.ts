import { lerColecao, salvarColecao } from '../servicos/colecaoArmazenada';
import { CartaApi } from '../tipos/api';
import { CartaColecao, ValoresCarta } from '../tipos/app';

export type DecisaoDuplicada = 'somar' | 'reativar';

export type SituacaoCadastro =
  | 'criada'
  | 'somada'
  | 'reativada'
  | 'duplicada_ativa'
  | 'duplicada_inativa';

export interface ResultadoCadastro {
  situacao: SituacaoCadastro;
  carta: CartaColecao; // a carta criada ou a que já existia
}

// Converte a carta da API para o formato guardado na coleção
function daApi(carta: CartaApi, valores: ValoresCarta, agora: string): CartaColecao {
  return {
    id: carta.id,
    nome: carta.name,
    supertype: carta.supertype ?? 'Desconhecida',
    tipos: carta.types ?? [],
    raridade: carta.rarity ?? null,
    edicao: carta.set?.name ?? null,
    imagemPequena: carta.images?.small ?? null,
    imagemGrande: carta.images?.large ?? null,
    ...valores,
    ativa: true,
    criadaEm: agora,
    atualizadaEm: agora,
  };
}

// POST: adiciona a carta à coleção. Se já existir, só age com a decisão do usuário
export async function cadastrarCarta(
  treinador: string,
  carta: CartaApi,
  valores: ValoresCarta,
  decisao?: DecisaoDuplicada,
): Promise<ResultadoCadastro> {
  const colecao = await lerColecao(treinador);
  const agora = new Date().toISOString();
  const indice = colecao.findIndex((item) => item.id === carta.id);

  // Carta nova
  if (indice === -1) {
    const nova = daApi(carta, valores, agora);
    await salvarColecao(treinador, [...colecao, nova]);
    return { situacao: 'criada', carta: nova };
  }

  const existente = colecao[indice];

  // Já existe e está ativa: só soma se o usuário aceitou
  if (existente.ativa) {
    if (decisao !== 'somar') return { situacao: 'duplicada_ativa', carta: existente };
    const somada: CartaColecao = {
      ...existente,
      quantidade: existente.quantidade + valores.quantidade,
      atualizadaEm: agora,
    };
    await salvarColecao(treinador, colecao.map((item, i) => (i === indice ? somada : item)));
    return { situacao: 'somada', carta: somada };
  }

  // Já existe e está inativa: só reativa se o usuário aceitou (usa os dados do formulário)
  if (decisao !== 'reativar') return { situacao: 'duplicada_inativa', carta: existente };
  const reativada: CartaColecao = {
    ...existente,
    ...valores,
    ativa: true,
    atualizadaEm: agora,
  };
  await salvarColecao(treinador, colecao.map((item, i) => (i === indice ? reativada : item)));
  return { situacao: 'reativada', carta: reativada };
}
