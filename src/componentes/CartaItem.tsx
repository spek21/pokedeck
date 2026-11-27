import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartaApi } from '../tipos/api';
import { textoTipos } from '../utils/formatacao';
import { ImagemCarta } from './ImagemCarta';

interface CartaItemProps {
  carta: CartaApi;
  aoPressar: (carta: CartaApi) => void;
}

// Linha da lista: imagem pequena + dados principais
export function CartaItem({ carta, aoPressar }: CartaItemProps) {
  return (
    <Pressable style={estilos.linha} onPress={() => aoPressar(carta)}>
      <ImagemCarta uri={carta.images?.small} largura={63} />
      <View style={estilos.dados}>
        <Text style={estilos.nome} numberOfLines={1}>
          {carta.name}
        </Text>
        {carta.supertype !== undefined ? (
          <>
            <Text style={estilos.detalhe}>
              {carta.supertype} · {textoTipos(carta.types)}
            </Text>
            <Text style={estilos.detalhe}>{carta.rarity ?? 'Sem raridade'}</Text>
            <Text style={estilos.edicao} numberOfLines={1}>
              {carta.set?.name ?? 'Edição desconhecida'}
            </Text>
          </>
        ) : (
          // A lista da API traz só nome e imagem: o resto aparece no detalhe
          <>
            <Text style={estilos.detalhe}>Toque para ver os detalhes</Text>
            <Text style={estilos.edicao} numberOfLines={1}>
              ID: {carta.id}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  dados: { flex: 1, marginLeft: 12 },
  nome: { fontSize: 17, fontWeight: '700', color: '#111827' },
  detalhe: { fontSize: 13, color: '#4b5563', marginTop: 2 },
  edicao: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});
