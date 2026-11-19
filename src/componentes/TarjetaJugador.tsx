import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Jugador } from '../modelos/jugador';
import { miniatura } from '../servicios/medios';
import { colores, colorPosicion, fuentes, medidas } from '../tema/tema';

// Props: los datos y las funciones que Inicio entrega a cada tarjeta.
interface Props {
  jugador: Jugador;
  alAbrir: (id: string) => void;
  alVerVideo: (id: string) => void;
}

const coma = (numero: number) => String(numero).replace('.', ',');

// memo permite reutilizar la tarjeta cuando sus props no han cambiado.
export const TarjetaJugador = memo(function TarjetaJugador({
  jugador,
  alAbrir,
  alVerVideo,
}: Props) {
  const color = colorPosicion[jugador.posicion] ?? colores.cian;
  const { puntos, rebotes, asistencias } = jugador.estadisticas;
  const [fotoFallida, setFotoFallida] = useState<string | null>(null);
  const mostrarFoto = jugador.foto && fotoFallida !== jugador.foto;

  return (
    <View style={estilos.tarjeta}>
      <Text style={[estilos.dorsalFondo, { color }]} aria-hidden pointerEvents="none">
        {jugador.dorsal}
      </Text>
      {/* La ficha y el vídeo son dos zonas de pulsación independientes. */}
      <Pressable
        onPress={() => alAbrir(jugador.id)}
        style={({ pressed }) => [estilos.contenido, pressed && estilos.pulsada]}
        accessibilityRole="button"
        accessibilityLabel={`${jugador.nombre} ${jugador.apellidos}, dorsal ${jugador.dorsal}, ${jugador.posicion}. Ver ficha`}
        testID={`tarjeta-${jugador.id}`}
      >
        <View style={[estilos.marcoFoto, { borderColor: color }]}>
          {mostrarFoto ? (
            <Image
              source={miniatura(jugador.foto, 144)}
              style={estilos.foto}
              contentFit="cover"
              contentPosition="top"
              transition={200}
              recyclingKey={jugador.foto}
              onError={() => setFotoFallida(jugador.foto)}
              accessibilityLabel={`Foto de ${jugador.nombre}`}
            />
          ) : (
            <Ionicons name="person" size={32} color={colores.texto3} />
          )}
        </View>
        <View style={estilos.datos}>
          <Text style={estilos.nombre} numberOfLines={2}>
            {jugador.nombre} <Text style={estilos.apellidos}>{jugador.apellidos}</Text>
          </Text>
          <View style={estilos.fila}>
            <Text style={[estilos.posicion, { color, borderColor: color }]}>
              {jugador.posicion}
            </Text>
            <Text style={estilos.dorsal}>#{jugador.dorsal}</Text>
          </View>
          <View style={estilos.fila}>
            <Text style={estilos.estadisticas}>{coma(puntos)} PTS</Text>
            <Text style={estilos.estadisticas}>{coma(rebotes)} REB</Text>
            <Text style={estilos.estadisticas}>{coma(asistencias)} AST</Text>
          </View>
        </View>
      </Pressable>
      {jugador.video ? (
        <Pressable
          onPress={() => alVerVideo(jugador.id)}
          style={({ pressed }) => [estilos.botonVideo, pressed && estilos.pulsada]}
          accessibilityRole="button"
          accessibilityLabel={`Ver el vídeo de ${jugador.nombre} ${jugador.apellidos}`}
          testID={`video-${jugador.id}`}
        >
          <Ionicons name="play" size={18} color={colores.naranja} />
        </Pressable>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colores.texto3} aria-hidden />
      )}
    </View>
  );
});

const estilos = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: medidas.hueco,
    marginBottom: 12,
    padding: 12,
    borderRadius: medidas.radio,
    borderWidth: 1,
    borderColor: colores.linea,
    backgroundColor: colores.vidrio,
    overflow: 'hidden',
  },
  contenido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: medidas.toque,
    borderRadius: medidas.radioS,
  },
  pulsada: { opacity: 0.75, transform: [{ scale: 0.985 }] },
  dorsalFondo: {
    position: 'absolute',
    right: 58,
    top: -18,
    fontFamily: fuentes.titulo,
    fontSize: 96,
    opacity: 0.07,
  },
  marcoFoto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colores.fondo2,
  },
  foto: { width: '100%', height: '100%' },
  datos: { flex: 1, gap: 6 },
  nombre: { color: colores.texto, fontFamily: fuentes.titulo, fontSize: 17 },
  apellidos: { color: colores.texto2, fontFamily: fuentes.tituloMedio },
  fila: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  posicion: {
    fontFamily: fuentes.textoFuerte,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dorsal: { color: colores.texto3, fontFamily: fuentes.datos, fontSize: 12 },
  estadisticas: { color: colores.texto2, fontFamily: fuentes.datos, fontSize: 11 },
  botonVideo: {
    width: medidas.toque,
    height: medidas.toque,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: medidas.toque / 2,
    borderWidth: 1,
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaTenue,
  },
});
