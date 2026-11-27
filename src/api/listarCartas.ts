import { lerColecao } from '../servicos/colecaoArmazenada';
import { CartaColecao } from '../tipos/app';

// GET: lista as cartas ATIVAS da coleção do treinador
export async function listarCartas(treinador: string): Promise<CartaColecao[]> {
  const todas = await lerColecao(treinador);
  return todas.filter((carta) => carta.ativa);
}
