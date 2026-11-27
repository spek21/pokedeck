import { Pressable, StyleSheet, Text, View } from 'react-native';
import { textoTotalCartas } from '../utils/formatacao';

interface CabecalhoColecaoProps {
  treinador: string;
  totalCartas: number;
  aoSair: () => void;
}

// Sem estado: tudo vem do pai por props
export function CabecalhoColecao({ treinador, totalCartas, aoSair }: CabecalhoColecaoProps) {
  return (
    <View style={estilos.cabecalho}>
      <View style={estilos.dados}>
        <Text style={estilos.treinador} numberOfLines={1}>
          {treinador}
        </Text>
        <Text style={estilos.total}>{textoTotalCartas(totalCartas)}</Text>
      </View>
      <Pressable onPress={aoSair} style={estilos.sair} hitSlop={8}>
        <Text style={estilos.textoSair}>Sair</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1d4ed8',
  },
  dados: { flex: 1, marginRight: 12 },
  treinador: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  total: { fontSize: 13, color: '#bfdbfe', marginTop: 2 },
  sair: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff33',
  },
  textoSair: { color: '#ffffff', fontWeight: '600' },
});
