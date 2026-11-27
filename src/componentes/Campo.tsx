import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface CampoProps extends TextInputProps {
  rotulo: string;
  erro?: string | null;
}

export function Campo({ rotulo, erro, editable = true, style, ...resto }: CampoProps) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        {...resto}
        editable={editable}
        placeholderTextColor="#9ca3af"
        style={[
          estilos.entrada,
          !editable && estilos.travado,
          !!erro && estilos.comErro,
          style,
        ]}
      />
      {!!erro && <Text style={estilos.textoErro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: 14 },
  rotulo: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  entrada: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  travado: { backgroundColor: '#e5e7eb', color: '#6b7280' },
  comErro: { borderColor: '#dc2626' },
  textoErro: { color: '#dc2626', fontSize: 13, marginTop: 4 },
});
