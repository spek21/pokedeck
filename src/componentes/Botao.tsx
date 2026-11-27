import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

export type VarianteBotao = 'primario' | 'secundario' | 'perigo';

interface BotaoProps {
  titulo: string;
  aoPressar: () => void;
  variante?: VarianteBotao;
  carregando?: boolean;
  desabilitado?: boolean;
}

export function Botao({
  titulo,
  aoPressar,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
}: BotaoProps) {
  const inativo = desabilitado || carregando;
  const corTexto = variante === 'secundario' ? '#1f2937' : '#ffffff';

  return (
    <Pressable
      onPress={aoPressar}
      disabled={inativo}
      style={[estilos.base, estilos[variante], inativo && estilos.inativo]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <Text style={[estilos.texto, { color: corTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primario: { backgroundColor: '#2563eb' },
  secundario: { backgroundColor: '#e5e7eb' },
  perigo: { backgroundColor: '#dc2626' },
  inativo: { opacity: 0.6 },
  texto: { fontSize: 16, fontWeight: '600' },
});
