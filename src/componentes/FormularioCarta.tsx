import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { mensagemDe } from '../servicos/http';
import { condicoes, DadosCarta, ErrosCarta, ValoresCarta } from '../tipos/app';
import { converter, validar } from '../utils/validacao';
import { Botao } from './Botao';
import { Campo } from './Campo';
import { ImagemCarta } from './ImagemCarta';

// Campo só de leitura (cinza), por exemplo o nome do Pokémon
export interface CampoTravado {
  rotulo: string;
  valor: string;
}

interface FormularioCartaProps {
  titulo: string;
  valoresIniciais: DadosCarta;
  camposTravados?: CampoTravado[];
  imagemUri?: string | null; // undefined = sem imagem no formulário
  salvar: (valores: ValoresCarta) => Promise<void>;
  cancelar: () => void;
}

export function FormularioCarta({
  titulo,
  valoresIniciais,
  camposTravados = [],
  imagemUri,
  salvar,
  cancelar,
}: FormularioCartaProps) {
  const [dados, setDados] = useState<DadosCarta>(valoresIniciais);
  const [erros, setErros] = useState<ErrosCarta>({});
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);

  // Troca só o campo informado e mantém o resto (spread)
  function alterar(campo: keyof DadosCarta, valor: string) {
    setDados((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar() {
    const encontrados = validar(dados);
    setErros(encontrados);
    if (Object.keys(encontrados).length > 0) return;

    setErroSalvar(null);
    setSalvando(true);
    try {
      await salvar(converter(dados));
    } catch (e) {
      // Falhou: mostra o erro e mantém tudo o que foi digitado
      setErroSalvar(mensagemDe(e));
    } finally {
      setSalvando(false);
    }
  }

  const temTravados = camposTravados.length > 0 || imagemUri !== undefined;

  return (
    <KeyboardAvoidingView
      style={estilos.raiz}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={estilos.titulo}>{titulo}</Text>

        {imagemUri !== undefined && (
          <View style={estilos.imagemTravada}>
            <ImagemCarta uri={imagemUri ?? undefined} largura={90} />
          </View>
        )}

        {camposTravados.map((campo) => (
          <Campo key={campo.rotulo} rotulo={campo.rotulo} value={campo.valor} editable={false} />
        ))}

        {temTravados && (
          <Text style={estilos.aviso}>
            Os dados em cinza vêm da API e não podem ser alterados.
          </Text>
        )}

        <Campo
          rotulo="Quantidade"
          value={dados.quantidade}
          onChangeText={(texto) => alterar('quantidade', texto)}
          keyboardType="number-pad"
          maxLength={4}
          editable={!salvando}
          erro={erros.quantidade}
        />

        <Text style={estilos.rotulo}>Condição</Text>
        <View style={estilos.condicoes}>
          {condicoes.map((condicao) => (
            <Pressable
              key={condicao}
              disabled={salvando}
              onPress={() => alterar('condicao', condicao)}
              style={[estilos.chip, dados.condicao === condicao && estilos.chipAtivo]}
            >
              <Text
                style={[estilos.textoChip, dados.condicao === condicao && estilos.textoChipAtivo]}
              >
                {condicao}
              </Text>
            </Pressable>
          ))}
        </View>

        <Campo
          rotulo="Preço (opcional)"
          value={dados.preco}
          onChangeText={(texto) => alterar('preco', texto)}
          placeholder="Ex.: 12,50"
          keyboardType="decimal-pad"
          editable={!salvando}
          erro={erros.preco}
        />

        <Campo
          rotulo="Anotações"
          value={dados.anotacoes}
          onChangeText={(texto) => alterar('anotacoes', texto)}
          placeholder="Ex.: comprada na feira"
          multiline
          numberOfLines={3}
          maxLength={200}
          editable={!salvando}
          style={estilos.anotacoes}
        />

        {!!erroSalvar && <Text style={estilos.erroSalvar}>{erroSalvar}</Text>}
      </ScrollView>

      <View style={estilos.rodape}>
        <View style={estilos.metade}>
          <Botao titulo="Cancelar" variante="secundario" aoPressar={cancelar} desabilitado={salvando} />
        </View>
        <View style={estilos.metade}>
          <Botao titulo="Salvar" aoPressar={enviar} carregando={salvando} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  conteudo: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 16 },
  imagemTravada: { alignSelf: 'center', opacity: 0.6, marginBottom: 14 },
  aviso: { fontSize: 12, color: '#b45309', marginBottom: 18, marginTop: -6 },
  rotulo: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  condicoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  chipAtivo: { backgroundColor: '#2563eb' },
  textoChip: { fontSize: 14, color: '#374151', fontWeight: '600' },
  textoChipAtivo: { color: '#ffffff' },
  anotacoes: { minHeight: 80, textAlignVertical: 'top' },
  erroSalvar: { color: '#dc2626', textAlign: 'center', marginTop: 4 },
  rodape: { flexDirection: 'row', gap: 12, padding: 16 },
  metade: { flex: 1 },
});
