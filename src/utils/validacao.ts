import { DadosCarta, ErrosCarta, ValoresCarta } from '../tipos/app';

// Preço aceita vírgula: "12,50" vira 12.5
function lerPreco(texto: string): number {
  return Number(texto.trim().replace(',', '.'));
}

// Devolve os erros por campo; objeto vazio = tudo certo
export function validar(dados: DadosCarta): ErrosCarta {
  const erros: ErrosCarta = {};

  const quantidade = dados.quantidade.trim();
  if (!/^\d+$/.test(quantidade) || Number(quantidade) < 1) {
    erros.quantidade = 'Informe um número inteiro de 1 ou mais.';
  }

  const preco = dados.preco.trim();
  if (preco !== '' && !/^\d+([.,]\d+)?$/.test(preco)) {
    erros.preco = 'Informe um preço válido, ex.: 12,50.';
  }

  return erros;
}

// Só chame depois de validar(): converte o texto em números
export function converter(dados: DadosCarta): ValoresCarta {
  const preco = dados.preco.trim();
  return {
    quantidade: Number(dados.quantidade.trim()),
    condicao: dados.condicao,
    preco: preco === '' ? null : lerPreco(preco),
    anotacoes: dados.anotacoes.trim(),
  };
}
