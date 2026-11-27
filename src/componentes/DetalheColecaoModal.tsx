import { ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartaColecao } from '../tipos/app';
import { formatarPreco, textoTipos } from '../utils/formatacao';
import { Botao } from './Botao';
import { ImagemCarta } from './ImagemCarta';

interface DetalheColecaoModalProps {
  carta: CartaColecao | null; // null = fechado
  aoFechar: () => void;
  aoEditar: () => void;
  aoInativar: () => void;
  aoReativar: () => void;
  formulario?: ReactNode; // quando existe, substitui o detalhe dentro do mesmo Modal
  confirmacao?: ReactNode; // janela de confirmação, dentro da mesma árvore do Modal
}

// Detalhe da carta guardada: imagem grande e dados da coleção
export function DetalheColecaoModal({
  carta,
  aoFechar,
  aoEditar,
  aoInativar,
  aoReativar,
  formulario,
  confirmacao,
}: DetalheColecaoModalProps) {
  return (
    <Modal visible={carta !== null} animationType="slide" onRequestClose={aoFechar}>
      <View style={estilos.tela}>
        {formulario ? (
          formulario
        ) : (
          <>
            {carta && !carta.ativa && (
              <View style={estilos.faixaInativa}>
                <Text style={estilos.textoFaixa}>Carta inativa</Text>
              </View>
            )}

            <ScrollView contentContainerStyle={estilos.conteudo}>
              {carta && (
                <>
                  <ImagemCarta key={carta.id} uri={carta.imagemGrande ?? undefined} largura={240} />
                  <Text style={estilos.nome}>{carta.nome}</Text>
                  <Text style={estilos.linha}>Quantidade: {carta.quantidade}</Text>
                  <Text style={estilos.linha}>Condição: {carta.condicao}</Text>
                  <Text style={estilos.linha}>Preço: {formatarPreco(carta.preco)}</Text>
                  <Text style={estilos.linha}>
                    Anotações: {carta.anotacoes === '' ? 'Nenhuma' : carta.anotacoes}
                  </Text>
                  <Text style={estilos.separador}>Dados da carta</Text>
                  <Text style={estilos.linha}>Categoria: {carta.supertype}</Text>
                  <Text style={estilos.linha}>Tipos: {textoTipos(carta.tipos)}</Text>
                  <Text style={estilos.linha}>Raridade: {carta.raridade ?? 'Sem raridade'}</Text>
                  <Text style={estilos.linha}>Edição: {carta.edicao ?? 'Desconhecida'}</Text>
                  <Text style={estilos.id}>ID: {carta.id}</Text>
                </>
              )}
            </ScrollView>

            <View style={estilos.rodape}>
              {carta && carta.ativa ? (
                <>
                  <Botao titulo="Editar" aoPressar={aoEditar} />
                  <Botao titulo="Inativar" variante="perigo" aoPressar={aoInativar} />
                </>
              ) : (
                <Botao titulo="Reativar" aoPressar={aoReativar} />
              )}
              <Botao titulo="Fechar" variante="secundario" aoPressar={aoFechar} />
            </View>
          </>
        )}
      </View>

      {confirmacao}
    </Modal>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f3f4f6', paddingTop: 40 },
  faixaInativa: { backgroundColor: '#9ca3af', paddingVertical: 8, alignItems: 'center' },
  textoFaixa: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  conteudo: { alignItems: 'center', padding: 20 },
  nome: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 16, marginBottom: 8 },
  linha: { fontSize: 15, color: '#374151', marginTop: 4, textAlign: 'center' },
  separador: { fontSize: 13, fontWeight: '700', color: '#6b7280', marginTop: 18 },
  id: { fontSize: 12, color: '#9ca3af', marginTop: 12 },
  rodape: { padding: 16, gap: 10 },
});
