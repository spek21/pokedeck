import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartaColecao } from '../tipos/app';

// Uma chave por treinador (sem diferenciar maiúsculas)
function chaveDe(treinador: string): string {
  return `pokedeck.colecao.${treinador.trim().toLowerCase()}`;
}

// Lê TODAS as cartas (ativas e inativas) do treinador
export async function lerColecao(treinador: string): Promise<CartaColecao[]> {
  const texto = await AsyncStorage.getItem(chaveDe(treinador));
  if (texto === null) return [];

  let bruto: unknown;
  try {
    bruto = JSON.parse(texto);
  } catch {
    throw new Error('Os dados salvos da coleção estão corrompidos.');
  }
  if (!Array.isArray(bruto)) {
    throw new Error('Os dados salvos da coleção estão corrompidos.');
  }
  return bruto as CartaColecao[];
}

export async function salvarColecao(treinador: string, cartas: CartaColecao[]): Promise<void> {
  await AsyncStorage.setItem(chaveDe(treinador), JSON.stringify(cartas));
}
