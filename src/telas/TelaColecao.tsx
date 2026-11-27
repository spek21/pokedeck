import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import { editarCarta } from '../api/editarCarta';
import { inativarCarta } from '../api/inativarCarta';
import { listarCartas } from '../api/listarCartas';
import { listarInativas } from '../api/listarInativas';
import { reativarCarta } from '../api/reativarCarta';
import { Botao } from '../componentes/Botao';
import { Campo } from '../componentes/Campo';
import { CartaColecaoItem } from '../componentes/CartaColecaoItem';
import { ConfirmarInativacao } from '../componentes/ConfirmarInativacao';
import { DetalheColecaoModal } from '../componentes/DetalheColecaoModal';
import { FormularioCarta } from '../componentes/FormularioCarta';
import { SeletorAgrupamento } from '../componentes/SeletorAgrupamento';
import { mensagemDe } from '../servicos/http';
import { CartaColecao, ValoresCarta } from '../tipos/app';
import { Agrupamento, SecaoCartas } from '../tipos/colecao';
import { daCartaParaDados, textoCopias } from '../utils/formatacao';
import { agruparPorNome, filtrarPorNome, ordenarPorNome } from '../utils/porNome';
import { agruparPorTipo } from '../utils/porTipo';

interface TelaColecaoProps {
  treinador: string;
  aoColecaoAlterada: () => void; // avisa o pai para recalcular o total
}

export function TelaColecao({ treinador, aoColecaoAlterada }: TelaColecaoProps) {
  const [cartas, setCartas] = useState<CartaColecao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [agrupamento, setAgrupamento] = useState<Agrupamento>('tipo');
  const [filtro, setFiltro] = useState('');
  const [selecionada, setSelecionada] = useState<CartaColecao | null>(null);
  const [editando, setEditando] = useState(false);
  const [verInativas, setVerInativas] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  // Lê a coleção salva no celular
  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setCartas(verInativas ? await listarInativas(treinador) : await listarCartas(treinador));
    } catch (e) {
      setErro(mensagemDe(e));
    } finally {
      setCarregando(false);
    }
  }, [treinador, verInativas]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Filtro e agrupamentos só recalculam quando algo muda
  const filtradas = useMemo(() => filtrarPorNome(cartas, filtro), [cartas, filtro]);
  const secoes = useMemo<SecaoCartas[]>(
    () => (agrupamento === 'tipo' ? agruparPorTipo(filtradas) : agruparPorNome(filtradas)),
    [filtradas, agrupamento],
  );
  const simples = useMemo(() => ordenarPorNome(filtradas), [filtradas]);

  // Texto da lista vazia, conforme a situação
  function textoVazio(): string {
    if (carregando) return 'Carregando coleção...';
    if (erro) return erro;
    if (cartas.length === 0) {
      return verInativas
        ? 'Nenhuma carta inativa.'
        : 'Sua coleção está vazia. Adicione cartas na aba Buscar.';
    }
    return `Nenhuma carta com "${filtro.trim()}" na coleção.`;
  }

  const vazio = <Text style={[estilos.vazio, !!erro && estilos.vazioErro]}>{textoVazio()}</Text>;

  // Salva a edição; se falhar, o erro sobe e o formulário mantém o digitado
  async function salvarEdicao(valores: ValoresCarta) {
    if (selecionada === null) return;
    const atualizada = await editarCarta(treinador, selecionada.id, valores);
    setSelecionada(atualizada);
    setEditando(false);
    await carregar();
    aoColecaoAlterada();
  }

  // Inativa (exclusão lógica); o erro sobe para a janela de confirmação
  async function confirmarInativacao() {
    if (selecionada === null) return;
    await inativarCarta(treinador, selecionada.id);
    setConfirmando(false);
    setSelecionada(null);
    await carregar();
    aoColecaoAlterada();
  }

  // Reativa uma carta inativa e volta para a lista
  async function reativar() {
    if (selecionada === null) return;
    try {
      await reativarCarta(treinador, selecionada.id);
    } catch (e) {
      setErroAcao(mensagemDe(e));
    }
    setSelecionada(null);
    await carregar();
    aoColecaoAlterada();
  }

  function alternarInativas() {
    setErroAcao(null);
    setVerInativas((atual) => !atual);
  }

  function fecharDetalhe() {
    setEditando(false);
    setConfirmando(false);
    setSelecionada(null);
  }

  function renderizarCarta(carta: CartaColecao) {
    return <CartaColecaoItem carta={carta} aoPressar={setSelecionada} />;
  }

  return (
    <View style={estilos.tela}>
      <Botao
        titulo={verInativas ? 'Ver ativas' : 'Ver inativas'}
        variante="secundario"
        aoPressar={alternarInativas}
      />

      {!!erroAcao && <Text style={estilos.erroAcao}>{erroAcao}</Text>}

      <Campo
        rotulo="Filtrar por nome"
        value={filtro}
        onChangeText={setFiltro}
        placeholder="Ex.: pikachu"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <SeletorAgrupamento valor={agrupamento} aoMudar={setAgrupamento} />

      {agrupamento === 'simples' ? (
        <FlatList
          data={simples}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderizarCarta(item)}
          refreshing={carregando}
          onRefresh={carregar}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={vazio}
        />
      ) : (
        <SectionList<CartaColecao, SecaoCartas>
          sections={secoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderizarCarta(item)}
          renderSectionHeader={({ section }) => (
            <View style={[estilos.cabecalhoSecao, { backgroundColor: section.cor }]}>
              <Text style={estilos.tituloSecao}>{section.titulo}</Text>
              <Text style={estilos.copiasSecao}>{textoCopias(section.copias)}</Text>
            </View>
          )}
          refreshing={carregando}
          onRefresh={carregar}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={vazio}
        />
      )}

      <DetalheColecaoModal
        carta={selecionada}
        aoFechar={fecharDetalhe}
        aoEditar={() => setEditando(true)}
        aoInativar={() => setConfirmando(true)}
        aoReativar={reativar}
        confirmacao={
          <ConfirmarInativacao
            visivel={confirmando}
            nomeCarta={selecionada?.nome ?? ''}
            confirmar={confirmarInativacao}
            cancelar={() => setConfirmando(false)}
          />
        }
        formulario={
          selecionada && editando ? (
            <FormularioCarta
              key={selecionada.id}
              titulo="Editar carta"
              valoresIniciais={daCartaParaDados(selecionada)}
              camposTravados={[
                { rotulo: 'Pokémon', valor: selecionada.nome },
                { rotulo: 'Edição', valor: selecionada.edicao ?? 'Desconhecida' },
              ]}
              imagemUri={selecionada.imagemPequena}
              salvar={salvarEdicao}
              cancelar={() => setEditando(false)}
            />
          ) : undefined
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  lista: { paddingBottom: 24, flexGrow: 1 },
  cabecalhoSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tituloSecao: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  copiasSecao: { fontSize: 13, fontWeight: '600', color: '#ffffffdd' },
  vazio: { textAlign: 'center', color: '#6b7280', marginTop: 32, fontSize: 15 },
  vazioErro: { color: '#dc2626' },
  erroAcao: { color: '#dc2626', textAlign: 'center', marginTop: 8 },
});
