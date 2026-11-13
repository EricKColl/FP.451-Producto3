import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { useJugador } from '../hooks/useJugadores';
import { PropsPantalla } from '../navegacion/tipos';
import { colores, fuentes, medidas } from '../tema/tema';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// VENTANA DETALLE · Persona 3 (Marc). Versión provisional de la Fase 0.
// Marc la sustituye por la ficha completa con todos los datos y la foto con zoom (guía, 8.3).
// CONTRATO (no cambiar): se llama DetalleScreen, recibe PropsPantalla<'Detalle'>, toma el id de
// route.params, lee el jugador con useJugador(id) y abre el vídeo con navigate('Multimedia', { id }).
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function DetalleScreen({ route, navigation }: PropsPantalla<'Detalle'>) {
  const { id } = route.params;
  const { datos: jugador, cargando, error } = useJugador(id);

  useEffect(() => {
    if (jugador)
      navigation.setOptions({
        title: `${jugador.nombre} ${jugador.apellidos}`,
      });
  }, [jugador, navigation]);

  if (cargando)
    return (
      <Fondo>
        <EstadoPantalla tipo="cargando" texto="Cargando la ficha…" />
      </Fondo>
    );
  if (error)
    return (
      <Fondo>
        <EstadoPantalla tipo="error" />
      </Fondo>
    );
  if (!jugador)
    return (
      <Fondo>
        <EstadoPantalla
          tipo="vacio"
          texto="Este jugador ya no está en la plantilla."
          accion={{
            texto: 'Volver al listado',
            alPulsar: () => navigation.popTo('Inicio'),
          }}
        />
      </Fondo>
    );

  return (
    <Fondo>
      <View style={estilos.caja} testID="ficha">
        <Text style={estilos.titulo}>Ventana Detalle (provisional · Persona 3)</Text>
        <Text style={estilos.texto}>
          {jugador.nombre} {jugador.apellidos} · #{jugador.dorsal} · {jugador.posicion}
        </Text>
        <Text style={estilos.texto}>Foto: {jugador.foto}</Text>
        <Pressable
          onPress={() => navigation.navigate('Multimedia', { id })}
          style={estilos.boton}
          testID="ficha-ver-video"
        >
          <Text style={estilos.textoBoton}>Ver vídeo</Text>
        </Pressable>
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
  boton: {
    alignSelf: 'flex-start',
    minHeight: medidas.toque,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colores.naranja,
  },
  textoBoton: {
    color: colores.fondo0,
    fontFamily: fuentes.titulo,
    fontSize: 15,
  },
});
