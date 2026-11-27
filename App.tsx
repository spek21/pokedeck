import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { listarCartas } from './src/api/listarCartas';
import { CabecalhoColecao } from './src/componentes/CabecalhoColecao';
import { apagarTreinador, lerTreinador, salvarTreinador } from './src/servicos/armazenamento';
import { mensagemDe } from './src/servicos/http';
import { TelaBusca } from './src/telas/TelaBusca';
import { TelaColecao } from './src/telas/TelaColecao';
import { TelaEntrada } from './src/telas/TelaEntrada';
import { somarCopias } from './src/utils/formatacao';

type Aba = 'buscar' | 'colecao';

export default function App() {
  const [treinador, setTreinador] = useState<string | null>(null);
  const [restaurando, setRestaurando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>('buscar');
  const [totalCartas, setTotalCartas] = useState<number>(0);

  // Restaura a sessão ao abrir o app
  useEffect(() => {
    async function restaurar() {
      try {
        setTreinador(await lerTreinador());
      } catch (e) {
        setErro(mensagemDe(e));
      } finally {
        setRestaurando(false);
      }
    }
    restaurar();
  }, []);

  // Recalcula o total do cabeçalho a partir da coleção salva
  const atualizarTotal = useCallback(async (nome: string) => {
    try {
      setTotalCartas(somarCopias(await listarCartas(nome)));
    } catch (e) {
      setErro(mensagemDe(e));
    }
  }, []);

  // Ao entrar ou restaurar a sessão, carrega o total; ao sair, zera
  useEffect(() => {
    if (treinador === null) {
      setTotalCartas(0);
      return;
    }
    atualizarTotal(treinador);
  }, [treinador, atualizarTotal]);

  async function entrar(nome: string) {
    await salvarTreinador(nome);
    setTreinador(nome);
    setAba('buscar');
  }

  async function sair() {
    try {
      await apagarTreinador();
      setTreinador(null);
      setErro(null);
    } catch (e) {
      setErro(mensagemDe(e));
    }
  }

  if (restaurando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={estilos.raiz}>
        {treinador === null ? (
          <TelaEntrada aoEntrar={entrar} />
        ) : (
          <>
            {/* Fora do conteúdo: fica fixo no topo */}
            <CabecalhoColecao treinador={treinador} totalCartas={totalCartas} aoSair={sair} />

            <View style={estilos.abas}>
              <Pressable
                style={[estilos.aba, aba === 'buscar' && estilos.abaAtiva]}
                onPress={() => setAba('buscar')}
              >
                <Text style={[estilos.textoAba, aba === 'buscar' && estilos.textoAbaAtiva]}>
                  Buscar
                </Text>
              </Pressable>
              <Pressable
                style={[estilos.aba, aba === 'colecao' && estilos.abaAtiva]}
                onPress={() => setAba('colecao')}
              >
                <Text style={[estilos.textoAba, aba === 'colecao' && estilos.textoAbaAtiva]}>
                  Coleção
                </Text>
              </Pressable>
            </View>

            {!!erro && <Text style={estilos.erro}>{erro}</Text>}

            {aba === 'buscar' ? (
              <TelaBusca
                treinador={treinador}
                aoColecaoAlterada={() => atualizarTotal(treinador)}
              />
            ) : (
              <TelaColecao
                treinador={treinador}
                aoColecaoAlterada={() => atualizarTotal(treinador)}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1, backgroundColor: '#f3f4f6' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  abas: { flexDirection: 'row', backgroundColor: '#ffffff' },
  aba: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  abaAtiva: { borderBottomColor: '#2563eb' },
  textoAba: { fontSize: 15, fontWeight: '600', color: '#6b7280' },
  textoAbaAtiva: { color: '#2563eb' },
  erro: { color: '#dc2626', padding: 12, textAlign: 'center' },
});
