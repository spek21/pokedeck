import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Botao } from '../componentes/Botao';
import { Campo } from '../componentes/Campo';
import { mensagemDe } from '../servicos/http';

interface TelaEntradaProps {
  aoEntrar: (nome: string) => Promise<void>;
}

// Valida o nome; devolve a mensagem de erro ou null se estiver ok
function validarNome(nome: string): string | null {
  if (nome.length < 2) return 'Digite pelo menos 2 caracteres.';
  if (nome.length > 30) return 'Use no máximo 30 caracteres.';
  return null;
}

export function TelaEntrada({ aoEntrar }: TelaEntradaProps) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    const nomeLimpo = nome.trim();
    const mensagem = validarNome(nomeLimpo);
    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro(null);
    setCarregando(true);
    try {
      await aoEntrar(nomeLimpo);
    } catch (e) {
      setErro(mensagemDe(e));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={estilos.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={estilos.caixa}>
        <Text style={estilos.titulo}>Pokédeck</Text>
        <Text style={estilos.subtitulo}>Sua coleção de cartas Pokémon TCG</Text>

        <Campo
          rotulo="Nome do treinador"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Treinador Ash"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={30}
          editable={!carregando}
          onSubmitEditing={entrar}
          returnKeyType="go"
          erro={erro}
        />

        <Botao titulo="Entrar" aoPressar={entrar} carregando={carregando} />

        {Platform.OS === 'web' && (
          <Text style={estilos.aviso}>
            Na web a sessão fica no localStorage do navegador (menos seguro que no celular).
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 24 },
  caixa: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20 },
  titulo: { fontSize: 32, fontWeight: '800', color: '#1d4ed8', textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  aviso: { marginTop: 12, fontSize: 12, color: '#b45309', textAlign: 'center' },
});
