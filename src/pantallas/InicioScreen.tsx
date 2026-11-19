import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { TarjetaJugador } from '../componentes/TarjetaJugador';
import { useJugadores } from '../hooks/useJugadores';
import { Jugador } from '../modelos/jugador';
import { PropsPantalla } from '../navegacion/tipos';
import { colores, fuentes, medidas } from '../tema/tema';

const BLOQUE = 6;

// Ventana Inicio: cabecera y tarjetas de Firebase en bloques de seis.
// El siguiente paso añadirá los filtros por posición.
export function InicioScreen({ navigation }: PropsPantalla<'Inicio'>) {
  const { datos: jugadores, cargando, error } = useJugadores();

  // Estado: React recuerda este límite y actualiza la pantalla cuando lo cambiamos.
  const [visibles, setVisibles] = useState(BLOQUE);
  // slice crea una lista nueva; la plantilla original de Firebase se conserva entera.
  const mostrados = jugadores.slice(0, visibles);
  const quedanMas = visibles < jugadores.length;

  const abrir = useCallback((id: string) => navigation.navigate('Detalle', { id }), [navigation]);
  const verVideo = useCallback(
    (id: string) => navigation.navigate('Multimedia', { id }),
    [navigation],
  );

  const mostrarMas = () => {
    if (quedanMas) setVisibles((anterior) => anterior + BLOQUE);
  };

  if (cargando)
    return (
      <Fondo>
        <EstadoPantalla tipo="cargando" />
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
      <FlatList<Jugador>
        data={mostrados}
        keyExtractor={(j) => j.id}
        renderItem={({ item }) => (
          <TarjetaJugador jugador={item} alAbrir={abrir} alVerVideo={verVideo} />
        )}
        // La cabecera forma parte del listado y se desplaza con las tarjetas.
        ListHeaderComponent={
          <View style={estilos.cabecera}>
            <Text style={estilos.antetitulo}>PLANTILLA · TEMPORADA 2026</Text>
            <Text style={estilos.titulo} accessibilityRole="header">
              Nuestros <Text style={estilos.tituloAcento}>jugadores</Text>
            </Text>
            <View style={estilos.estado} testID="estado-conexion">
              <View style={estilos.punto} aria-hidden />
              <Text style={estilos.textoEstado}>{jugadores.length} jugadores · desde Firebase</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          jugadores.length > 0 ? (
            <View style={estilos.pie}>
              <Text style={estilos.textoPie} testID="progreso-listado">
                Mostrando {mostrados.length} de {jugadores.length} jugadores
              </Text>
              <Text style={estilos.textoPie}>
                {quedanMas ? 'Desliza para ver más' : 'Has visto toda la plantilla'}
              </Text>
            </View>
          ) : undefined
        }
        onEndReached={mostrarMas}
        onEndReachedThreshold={0.4}
        contentContainerStyle={estilos.lista}
        testID="lista-jugadores"
      />
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  lista: { paddingBottom: 24 },
  cabecera: { paddingHorizontal: medidas.hueco, paddingTop: 20, paddingBottom: 20, gap: 10 },
  antetitulo: { color: colores.naranja, fontFamily: fuentes.datos, fontSize: 11, letterSpacing: 2 },
  titulo: { color: colores.texto, fontFamily: fuentes.titulo, fontSize: 32, lineHeight: 36 },
  tituloAcento: { color: colores.cian },
  estado: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  punto: { width: 8, height: 8, borderRadius: 4, backgroundColor: colores.cian },
  textoEstado: { color: colores.texto2, fontFamily: fuentes.texto, fontSize: 13, flex: 1 },
  pie: { padding: medidas.hueco, gap: 6, alignItems: 'center' },
  textoPie: { color: colores.texto3, fontFamily: fuentes.texto, fontSize: 12 },
});
