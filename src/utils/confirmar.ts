import { Alert, Platform } from 'react-native';

// Pergunta sim/não e devolve a resposta (Alert no celular, window.confirm na web)
export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }

  return new Promise<boolean>((resolver) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
        { text: textoConfirmar, onPress: () => resolver(true) },
      ],
      { cancelable: true, onDismiss: () => resolver(false) },
    );
  });
}
