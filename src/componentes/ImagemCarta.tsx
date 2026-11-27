import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

interface ImagemCartaProps {
  uri?: string;
  largura: number;
}

// Proporção de uma carta Pokémon: 63 x 88
export function ImagemCarta({ uri, largura }: ImagemCartaProps) {
  const [carregou, setCarregou] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const altura = Math.round((largura * 88) / 63);
  const semImagem = !uri || falhou;

  return (
    <View style={[estilos.caixa, { width: largura, height: altura }]}>
      {/* Placeholder: aparece até a imagem carregar */}
      {!carregou && !semImagem && <ActivityIndicator color="#9ca3af" />}

      {/* Fallback: sem endereço ou erro ao baixar */}
      {semImagem && <Text style={estilos.fallback}>Sem imagem</Text>}

      {!semImagem && (
        <Image
          source={{ uri }}
          style={[estilos.imagem, !carregou && estilos.oculta]}
          resizeMode="contain"
          onLoad={() => setCarregou(true)}
          onError={() => setFalhou(true)}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagem: { ...StyleSheet.absoluteFillObject },
  oculta: { opacity: 0 },
  fallback: { fontSize: 11, color: '#6b7280', textAlign: 'center' },
});
