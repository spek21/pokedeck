import { ReactNode } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartaApi } from '../tipos/api';
import { textoTipos } from '../utils/formatacao';
import { Botao } from './Botao';
import { ImagemCarta } from './ImagemCarta';

interface DetalheCartaModalProps {
  visivel: boolean;
  carta: CartaApi | null;
  carregando: boolean;
  erro: string | null;
  aoFechar: () => void;
  aoAdicionar: () => void;
  formulario?: ReactNode; // quando existe, substitui o detalhe dentro do mesmo Modal
}

// Só mostra o que recebe: quem busca o detalhe é a tela
export function DetalheCartaModal({
  visivel,
  carta,
  carregando,
  erro,
  aoFechar,
  aoAdicionar,
  formulario,
}: DetalheCartaModalProps) {
  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={aoFechar}>
      <View style={estilos.tela}>
        {formulario ? (
          formulario
        ) : (
          <>
            <ScrollView contentContainerStyle={estilos.conteudo}>
              {carregando && <ActivityIndicator size="large" color="#2563eb" />}

              {!!erro && <Text style={estilos.erro}>{erro}</Text>}

              {carta && (
                <>
                  <ImagemCarta key={carta.id} uri={carta.images?.large} largura={240} />
                  <Text style={estilos.nome}>{carta.name}</Text>
                  <Text style={estilos.linha}>Categoria: {carta.supertype ?? 'Desconhecida'}</Text>
                  <Text style={estilos.linha}>Tipos: {textoTipos(carta.types)}</Text>
                  <Text style={estilos.linha}>Raridade: {carta.rarity ?? 'Sem raridade'}</Text>
                  <Text style={estilos.linha}>Edição: {carta.set?.name ?? 'Desconhecida'}</Text>
                  {!!carta.set?.series && (
                    <Text style={estilos.linha}>Série: {carta.set.series}</Text>
                  )}
                  <Text style={estilos.id}>ID: {carta.id}</Text>
                </>
              )}
            </ScrollView>

            <View style={estilos.rodape}>
              <Botao
                titulo="Adicionar à coleção"
                aoPressar={aoAdicionar}
                desabilitado={carta === null}
              />
              <Botao titulo="Fechar" variante="secundario" aoPressar={aoFechar} />
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 40 },
  conteudo: { alignItems: 'center', padding: 20 },
  nome: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 16, marginBottom: 8 },
  linha: { fontSize: 15, color: '#374151', marginTop: 4 },
  id: { fontSize: 12, color: '#9ca3af', marginTop: 12 },
  erro: { color: '#dc2626', textAlign: 'center', marginBottom: 12 },
  rodape: { padding: 16, gap: 10 },
});
