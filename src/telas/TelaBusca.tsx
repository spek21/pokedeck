import { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { buscarCarta } from '../api/buscarCarta';
import { buscarCartasApi } from '../api/buscarCartasApi';
import { cadastrarCarta, SituacaoCadastro } from '../api/cadastrarCarta';
import { Campo } from '../componentes/Campo';
import { CartaItem } from '../componentes/CartaItem';
import { DetalheCartaModal } from '../componentes/DetalheCartaModal';
import { FormularioCarta } from '../componentes/FormularioCarta';
import { mensagemDe } from '../servicos/http';
import { CartaApi } from '../tipos/api';
import { dadosIniciaisCarta, ValoresCarta } from '../tipos/app';
import { confirmar } from '../utils/confirmar';

const atrasoBusca = 500; // debounce em ms
const minimoLetras = 2;

interface TelaBuscaProps {
  treinador: string;
  aoColecaoAlterada: () => void; // avisa o pai para recalcular o total
}

// Mensagem de sucesso conforme o que aconteceu
function textoSucesso(situacao: SituacaoCadastro): string {
  if (situacao === 'somada') return 'Quantidade somada à carta que você já tinha.';
  if (situacao === 'reativada') return 'Carta reativada na coleção.';
  return 'Carta adicionada à coleção!';
}

export function TelaBusca({ treinador, aoColecaoAlterada }: TelaBuscaProps) {
  const [termo, setTermo] = useState('');
  const [cartas, setCartas] = useState<CartaApi[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [buscou, setBuscou] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  // Muda ao puxar para atualizar e refaz a busca
  const [recarga, setRecarga] = useState(0);

  // Detalhe e formulário no mesmo Modal
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [detalhe, setDetalhe] = useState<CartaApi | null>(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [erroDetalhe, setErroDetalhe] = useState<string | null>(null);
  const idDetalhe = useRef<string | null>(null);

  // Debounce: espera 500 ms sem digitar e cancela a busca anterior
  useEffect(() => {
    const termoLimpo = termo.trim();
    if (termoLimpo.length < minimoLetras) {
      setCartas([]);
      setErro(null);
      setBuscou(false);
      setCarregando(false);
      return;
    }

    const controle = new AbortController();
    const espera = setTimeout(async () => {
      setCarregando(true);
      setErro(null);
      try {
        const lista = await buscarCartasApi(termoLimpo, controle.signal);
        setCartas(lista);
        setBuscou(true);
      } catch (e) {
        if (controle.signal.aborted) return;
        setCartas([]);
        setBuscou(false);
        setErro(mensagemDe(e));
      } finally {
        if (!controle.signal.aborted) setCarregando(false);
      }
    }, atrasoBusca);

    // Limpeza: roda quando o termo muda ou a tela fecha
    return () => {
      clearTimeout(espera);
      controle.abort();
    };
  }, [termo, recarga]);

  function alterarTermo(texto: string) {
    setTermo(texto);
    setAviso(null);
  }

  async function abrirDetalhe(carta: CartaApi) {
    idDetalhe.current = carta.id;
    setDetalhe(null);
    setErroDetalhe(null);
    setFormularioAberto(false);
    setCarregandoDetalhe(true);
    setDetalheAberto(true);
    try {
      const completa = await buscarCarta(carta.id);
      if (idDetalhe.current !== carta.id) return; // já fechou ou abriu outra
      setDetalhe(completa);
    } catch (e) {
      if (idDetalhe.current !== carta.id) return;
      setErroDetalhe(mensagemDe(e));
    } finally {
      if (idDetalhe.current === carta.id) setCarregandoDetalhe(false);
    }
  }

  function fecharDetalhe() {
    idDetalhe.current = null;
    setFormularioAberto(false);
    setDetalheAberto(false);
  }

  // Salva na coleção; se a carta já existe, pergunta o que fazer
  async function salvarCarta(valores: ValoresCarta): Promise<void> {
    const carta = detalhe;
    if (carta === null) return;

    let resultado = await cadastrarCarta(treinador, carta, valores);

    if (resultado.situacao === 'duplicada_ativa') {
      const somar = await confirmar(
        'Carta repetida',
        `Você já tem ${resultado.carta.nome} na coleção (${resultado.carta.quantidade} cópias). Somar mais ${valores.quantidade}?`,
        'Somar',
      );
      if (!somar) return; // fica no formulário, sem perder o digitado
      resultado = await cadastrarCarta(treinador, carta, valores, 'somar');
    } else if (resultado.situacao === 'duplicada_inativa') {
      const reativar = await confirmar(
        'Carta inativa',
        `${resultado.carta.nome} está inativa na coleção. Reativar com os dados informados?`,
        'Reativar',
      );
      if (!reativar) return;
      resultado = await cadastrarCarta(treinador, carta, valores, 'reativar');
    }

    aoColecaoAlterada();
    setAviso(textoSucesso(resultado.situacao));
    fecharDetalhe();
  }

  // Texto da lista vazia, conforme a situação
  function textoVazio(): string {
    if (carregando) return 'Buscando cartas...';
    if (erro) return erro;
    if (termo.trim().length < minimoLetras) {
      return 'Digite o nome de um Pokémon (mínimo 2 letras).';
    }
    if (buscou) return `Nenhuma carta encontrada para "${termo.trim()}".`;
    return '';
  }

  return (
    <View style={estilos.tela}>
      <Campo
        rotulo="Buscar carta pelo nome"
        value={termo}
        onChangeText={alterarTermo}
        placeholder="Ex.: pikachu"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {!!aviso && <Text style={estilos.aviso}>{aviso}</Text>}

      <FlatList
        data={cartas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartaItem carta={item} aoPressar={abrirDetalhe} />}
        refreshing={carregando}
        onRefresh={() => setRecarga((r) => r + 1)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={
          <Text style={[estilos.vazio, !!erro && estilos.vazioErro]}>{textoVazio()}</Text>
        }
      />

      <DetalheCartaModal
        visivel={detalheAberto}
        carta={detalhe}
        carregando={carregandoDetalhe}
        erro={erroDetalhe}
        aoFechar={fecharDetalhe}
        aoAdicionar={() => setFormularioAberto(true)}
        formulario={
          formularioAberto && detalhe ? (
            <FormularioCarta
              titulo="Adicionar à coleção"
              valoresIniciais={dadosIniciaisCarta}
              camposTravados={[
                { rotulo: 'Pokémon', valor: detalhe.name },
                { rotulo: 'Edição', valor: detalhe.set?.name ?? 'Desconhecida' },
              ]}
              imagemUri={detalhe.images?.small ?? null}
              salvar={salvarCarta}
              cancelar={() => setFormularioAberto(false)}
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
  aviso: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  vazio: { textAlign: 'center', color: '#6b7280', marginTop: 32, fontSize: 15 },
  vazioErro: { color: '#dc2626' },
});
