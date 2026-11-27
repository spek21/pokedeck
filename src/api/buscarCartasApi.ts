import { rotas } from '../config';
import { ErroHttp, requisicao } from '../servicos/http';
import { CartaApi, ResumoCartaTcgdex } from '../tipos/api';
import { daResumo } from './converterCarta';

const porPagina = 20;

// GET /cards?name=...: lista até 20 cartas cujo nome contém o texto
export async function buscarCartasApi(nome: string, sinal?: AbortSignal): Promise<CartaApi[]> {
  // Esses símbolos têm função especial no filtro da API
  const limpo = nome.replace(/[*|:]/g, '').trim();
  if (limpo.length === 0) return [];

  try {
    const resposta = await requisicao<ResumoCartaTcgdex[]>(rotas.cartas, {
      parametros: { name: limpo, 'pagination:page': 1, 'pagination:itemsPerPage': porPagina },
      sinal,
    });
    return resposta.map(daResumo);
  } catch (e) {
    // 404 na busca = nenhuma carta com esse nome
    if (e instanceof ErroHttp && e.status === 404) return [];
    throw e;
  }
}
