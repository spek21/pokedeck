import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Agrupamento } from '../tipos/colecao';

interface SeletorAgrupamentoProps {
  valor: Agrupamento;
  aoMudar: (novo: Agrupamento) => void;
}

const opcoes: { valor: Agrupamento; rotulo: string }[] = [
  { valor: 'tipo', rotulo: 'Por tipo' },
  { valor: 'nome', rotulo: 'Por nome' },
  { valor: 'simples', rotulo: 'Lista simples' },
];

// Sem estado: o pai guarda o modo escolhido
export function SeletorAgrupamento({ valor, aoMudar }: SeletorAgrupamentoProps) {
  return (
    <View style={estilos.linha}>
      {opcoes.map((opcao) => (
        <Pressable
          key={opcao.valor}
          onPress={() => aoMudar(opcao.valor)}
          style={[estilos.opcao, valor === opcao.valor && estilos.opcaoAtiva]}
        >
          <Text style={[estilos.texto, valor === opcao.valor && estilos.textoAtivo]}>
            {opcao.rotulo}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  opcao: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  opcaoAtiva: { backgroundColor: '#2563eb' },
  texto: { fontSize: 13, fontWeight: '600', color: '#374151' },
  textoAtivo: { color: '#ffffff' },
});
