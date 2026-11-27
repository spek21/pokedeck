import { rotas } from '../config';
import { requisicao } from '../servicos/http';
import { CartaApi, CartaTcgdex } from '../tipos/api';
import { daDetalhe } from './converterCarta';

// GET /cards/{id}: detalhe de uma carta (404 vira "Não encontrado.")
export async function buscarCarta(id: string): Promise<CartaApi> {
  const resposta = await requisicao<CartaTcgdex>(rotas.carta(id));
  return daDetalhe(resposta);
}
