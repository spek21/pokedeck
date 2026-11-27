import { lerColecao, salvarColecao } from '../servicos/colecaoArmazenada';
import { CartaColecao, ValoresCarta } from '../tipos/app';

// PUT parcial: só quantidade, condição, preço e anotações mudam
export async function editarCarta(
  treinador: string,
  id: string,
  alteracoes: Partial<ValoresCarta>,
): Promise<CartaColecao> {
  const colecao = await lerColecao(treinador);
  const indice = colecao.findIndex((item) => item.id === id);

  if (indice === -1) {
    throw new Error('Carta não encontrada na coleção.');
  }

  const existente = colecao[indice];
  if (!existente.ativa) {
    throw new Error('Esta carta está inativa. Reative-a antes de editar.');
  }

  // Copia campo a campo: nome, imagem e edição nunca mudam.
  // Preço aceita null (apagar o preço), então compara com undefined.
  const atualizada: CartaColecao = {
    ...existente,
    quantidade: alteracoes.quantidade ?? existente.quantidade,
    condicao: alteracoes.condicao ?? existente.condicao,
    preco: alteracoes.preco !== undefined ? alteracoes.preco : existente.preco,
    anotacoes: alteracoes.anotacoes ?? existente.anotacoes,
    atualizadaEm: new Date().toISOString(),
  };

  await salvarColecao(
    treinador,
    colecao.map((item, i) => (i === indice ? atualizada : item)),
  );
  return atualizada;
}
