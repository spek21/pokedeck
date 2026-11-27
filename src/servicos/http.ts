import { config } from '../config';

export type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface OpcoesRequisicao {
  metodo?: MetodoHttp;
  corpo?: unknown;
  parametros?: Record<string, string | number>;
  sinal?: AbortSignal;
}

// Erro com status HTTP (null quando nem chegou ao servidor)
export class ErroHttp extends Error {
  status: number | null;

  constructor(mensagem: string, status: number | null) {
    super(mensagem);
    this.name = 'ErroHttp';
    this.status = status;
    Object.setPrototypeOf(this, ErroHttp.prototype);
  }
}

function montarUrl(
  caminho: string,
  parametros?: Record<string, string | number>,
): string {
  let url = `${config.urlBase}${caminho}`;
  if (parametros) {
    const consulta = Object.entries(parametros)
      // Os dois-pontos da chave (pagination:page) ficam como estão, como na documentação
      .map(([k, v]) => `${encodeURIComponent(k).replace(/%3A/g, ':')}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (consulta) url += `?${consulta}`;
  }
  return url;
}

const tentativasExtras = 2; // novas tentativas em GET quando o servidor falha (5xx)
const esperaEntreTentativas = 1500; // ms

// Pausa curta entre tentativas
function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

function mensagemDoStatus(status: number): string {
  if (status === 404) return 'Não encontrado.';
  if (status === 429) return 'Muitas requisições. Aguarde um instante e tente de novo.';
  if (status >= 500) return `A API está com problemas (código ${status}). Tente mais tarde.`;
  return `Erro na requisição (código ${status}).`;
}

// Única função que fala com a rede: URL, cabeçalhos, JSON e erros
export async function requisicao<T>(
  caminho: string,
  opcoes: OpcoesRequisicao = {},
): Promise<T> {
  const { metodo = 'GET', corpo, parametros, sinal } = opcoes;

  const cabecalhos: Record<string, string> = { Accept: 'application/json' };
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';

  let resposta: Response | null = null;
  // Só GET repete: POST/PUT/DELETE repetidos poderiam duplicar a ação
  const maximo = metodo === 'GET' ? tentativasExtras + 1 : 1;

  for (let tentativa = 1; tentativa <= maximo; tentativa++) {
    try {
      resposta = await fetch(montarUrl(caminho, parametros), {
        method: metodo,
        headers: cabecalhos,
        body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
        signal: sinal,
      });
    } catch (erro) {
      // Busca cancelada de propósito: quem chamou decide o que fazer
      if (erro instanceof Error && erro.name === 'AbortError') throw erro;
      throw new ErroHttp('Sem conexão com a internet. Verifique a rede.', null);
    }

    // Erro do servidor (5xx): espera e tenta de novo, se ainda houver tentativa
    if (resposta.status >= 500 && tentativa < maximo) {
      await esperar(esperaEntreTentativas);
      continue;
    }
    break;
  }

  if (resposta === null) {
    throw new ErroHttp('Sem resposta da API.', null);
  }

  if (!resposta.ok) {
    throw new ErroHttp(mensagemDoStatus(resposta.status), resposta.status);
  }

  if (resposta.status === 204) return undefined as T;

  try {
    return (await resposta.json()) as T;
  } catch {
    throw new ErroHttp('Resposta inválida da API.', resposta.status);
  }
}

// Converte qualquer erro em texto para mostrar ao usuário
export function mensagemDe(erro: unknown): string {
  if (erro instanceof Error) return erro.message;
  return 'Ocorreu um erro inesperado.';
}
