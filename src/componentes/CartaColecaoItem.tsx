import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CartaColecao } from '../tipos/app';
import { formatarPreco, textoTipos } from '../utils/formatacao';
import { ImagemCarta } from './ImagemCarta';

interface CartaColecaoItemProps {
  carta: CartaColecao;
  aoPressar: (carta: CartaColecao) => void;
}

// Linha da coleção: imagem pequena + dados da carta guardada
export function CartaColecaoItem({ carta, aoPressar }: CartaColecaoItemProps) {
  return (
    <Pressable style={estilos.linha} onPress={() => aoPressar(carta)}>
      <ImagemCarta uri={carta.imagemPequena ?? undefined} largura={63} />
      <View style={estilos.dados}>
        <Text style={estilos.nome} numberOfLines={1}>
          {carta.nome}
        </Text>
        <Text style={estilos.destaque}>
          {carta.quantidade}x · {carta.condicao}
        </Text>
        <Text style={estilos.detalhe}>
          {carta.supertype} · {textoTipos(carta.tipos)}
        </Text>
        <Text style={estilos.detalhe}>{formatarPreco(carta.preco)}</Text>
        <Text style={estilos.edicao} numberOfLines={1}>
          {carta.edicao ?? 'Edição desconhecida'}
        </Text>
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
  destaque: { fontSize: 14, fontWeight: '600', color: '#2563eb', marginTop: 2 },
  detalhe: { fontSize: 13, color: '#4b5563', marginTop: 2 },
  edicao: { fontSize: 12, color: '#6b7280', marginTop: 4 },
});
