import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const chaveTreinador = 'pokedeck.treinador';

// Na web não existe SecureStore: usa localStorage (menos seguro)
export const armazenamentoSeguro: boolean = Platform.OS !== 'web';

export async function lerTreinador(): Promise<string | null> {
  if (!armazenamentoSeguro) return localStorage.getItem(chaveTreinador);
  return SecureStore.getItemAsync(chaveTreinador);
}

export async function salvarTreinador(nome: string): Promise<void> {
  if (!armazenamentoSeguro) {
    localStorage.setItem(chaveTreinador, nome);
    return;
  }
  await SecureStore.setItemAsync(chaveTreinador, nome);
}

export async function apagarTreinador(): Promise<void> {
  if (!armazenamentoSeguro) {
    localStorage.removeItem(chaveTreinador);
    return;
  }
  await SecureStore.deleteItemAsync(chaveTreinador);
}
