import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { mensagemDe } from '../servicos/http';
import { Botao } from './Botao';

interface ConfirmarInativacaoProps {
  visivel: boolean;
  nomeCarta: string;
  confirmar: () => Promise<void>;
  cancelar: () => void;
}

// Janela de confirmação: se confirmar() falhar, o erro aparece aqui dentro
export function ConfirmarInativacao({
  visivel,
  nomeCarta,
  confirmar,
  cancelar,
}: ConfirmarInativacaoProps) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function inativar() {
    setErro(null);
    setCarregando(true);
    try {
      await confirmar();
    } catch (e) {
      setErro(mensagemDe(e));
    } finally {
      setCarregando(false);
    }
  }

  // Cancelar só vale quando nada está rodando
  function fechar() {
    if (carregando) return;
    setErro(null);
    cancelar();
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={fechar}>
      <View style={estilos.fundo}>
        <View style={estilos.caixa}>
          <Text style={estilos.titulo}>Inativar carta</Text>
          <Text style={estilos.texto}>
            Inativar "{nomeCarta}"? Ela continua guardada e pode ser reativada.
          </Text>

          {!!erro && <Text style={estilos.erro}>{erro}</Text>}

          <View style={estilos.botoes}>
            <Botao titulo="Inativar" variante="perigo" carregando={carregando} aoPressar={inativar} />
            <Botao
              titulo="Cancelar"
              variante="secundario"
              desabilitado={carregando}
              aoPressar={fechar}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  // Fundo escuro semitransparente, caixa centralizada
  fundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 24,
  },
  caixa: { backgroundColor: '#ffffff', borderRadius: 14, padding: 20 },
  titulo: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 8 },
  texto: { fontSize: 15, color: '#374151', marginBottom: 12 },
  erro: { color: '#dc2626', marginBottom: 12 },
  botoes: { gap: 10 },
});
