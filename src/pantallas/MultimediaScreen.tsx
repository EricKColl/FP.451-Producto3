import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { useJugador } from '../hooks/useJugadores';
import { PropsPantalla } from '../navegacion/tipos';
import { colores, fuentes, medidas } from '../tema/tema';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// VENTANA MULTIMEDIA · Persona 4 (Carles). Versión provisional de la Fase 0.
// Carles la sustituye por el reproductor con expo-video y al menos 4 controles (guía, 8.4).
// CONTRATO (no cambiar): se llama MultimediaScreen, recibe PropsPantalla<'Multimedia'>, toma el id
// de route.params y lee el jugador con useJugador(id); la URL del vídeo está en jugador.video.
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function MultimediaScreen({ route, navigation }: PropsPantalla<'Multimedia'>) {
  const { id } = route.params;
  const { datos: jugador, cargando, error } = useJugador(id);

  useEffect(() => {
    if (jugador)
      navigation.setOptions({
        title: `Vídeo · ${jugador.nombre} ${jugador.apellidos}`,
      });
  }, [jugador, navigation]);

  if (cargando)
    return (
      <Fondo>
        <EstadoPantalla tipo="cargando" texto="Cargando el vídeo…" />
      </Fondo>
    );
  if (error)
    return (
      <Fondo>
        <EstadoPantalla tipo="error" />
      </Fondo>
    );

  return (
    <Fondo>
      <View style={estilos.caja}>
        <Text style={estilos.titulo}>Ventana Multimedia (provisional · Persona 4)</Text>
        <Text style={estilos.texto}>
          {jugador ? `${jugador.nombre} ${jugador.apellidos}` : 'Jugador no encontrado'}
        </Text>
        <Text style={estilos.texto} testID="url-video">
          Vídeo: {jugador?.video || 'sin vídeo'}
        </Text>
      </View>
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  caja: {
    margin: medidas.hueco,
    padding: 16,
    gap: 10,
    borderRadius: medidas.radio,
    borderWidth: 1,
    borderColor: colores.linea,
    backgroundColor: colores.vidrio,
  },
  titulo: { color: colores.naranja, fontFamily: fuentes.titulo, fontSize: 16 },
  texto: { color: colores.texto, fontFamily: fuentes.texto, fontSize: 14 },
});
