import { lerColecao, salvarColecao } from '../servicos/colecaoArmazenada';
import { CartaColecao } from '../tipos/app';

// DELETE lógico: marca ativa:false e mantém a carta guardada
export async function inativarCarta(treinador: string, id: string): Promise<CartaColecao> {
  const colecao = await lerColecao(treinador);
  const indice = colecao.findIndex((item) => item.id === id);

  if (indice === -1) {
    throw new Error('Carta não encontrada na coleção.');
  }

  const inativada: CartaColecao = {
    ...colecao[indice],
    ativa: false,
    atualizadaEm: new Date().toISOString(),
  };

  // Nunca remove do array: só troca a carta pela versão inativa
  await salvarColecao(
    treinador,
    colecao.map((item, i) => (i === indice ? inativada : item)),
  );
  return inativada;
}
