import { lerColecao, salvarColecao } from '../servicos/colecaoArmazenada';
import { CartaColecao } from '../tipos/app';

// Volta ativa:true e mantém os dados antigos (quantidade, preço, anotações)
export async function reativarCarta(treinador: string, id: string): Promise<CartaColecao> {
  const colecao = await lerColecao(treinador);
  const indice = colecao.findIndex((item) => item.id === id);

  if (indice === -1) {
    throw new Error('Carta não encontrada na coleção.');
  }

  const reativada: CartaColecao = {
    ...colecao[indice],
    ativa: true,
    atualizadaEm: new Date().toISOString(),
  };

  await salvarColecao(
    treinador,
    colecao.map((item, i) => (i === indice ? reativada : item)),
  );
  return reativada;
}
