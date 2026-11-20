import { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { TarjetaJugador } from '../componentes/TarjetaJugador';
import { useJugadores } from '../hooks/useJugadores';
import { Jugador, Posicion } from '../modelos/jugador';
import { PropsPantalla } from '../navegacion/tipos';
import { colores, colorPosicion, fuentes, medidas } from '../tema/tema';

const BLOQUE = 6;
const POSICIONES: Posicion[] = ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'];
// «1 jugador», «10 jugadores»
const jugadoresTexto = (n: number) => `${n} ${n === 1 ? 'jugador' : 'jugadores'}`;

// Ventana Inicio: tarjetas de Firebase, filtros por posición y listado por bloques.
export function InicioScreen({ navigation }: PropsPantalla<'Inicio'>) {
  const { datos: jugadores, cargando, error } = useJugadores();

  const [filtro, setFiltro] = useState<Posicion | null>(null); // null significa «Todos».
  const [visibles, setVisibles] = useState(BLOQUE);
  const lista = useRef<FlatList<Jugador>>(null);

  // Primero filtramos la plantilla completa; después seleccionamos el bloque visible.
  // filter y slice conservan los datos originales que llegan de Firebase.
  const filtrados = filtro ? jugadores.filter((jugador) => jugador.posicion === filtro) : jugadores;
  const mostrados = filtrados.slice(0, visibles);
  const quedanMas = visibles < filtrados.length;

  const abrir = useCallback((id: string) => navigation.navigate('Detalle', { id }), [navigation]);
  const verVideo = useCallback(
    (id: string) => navigation.navigate('Multimedia', { id }),
    [navigation],
  );

  const cambiarFiltro = (posicion: Posicion | null) => {
    setFiltro(posicion);
    setVisibles(BLOQUE);
    lista.current?.scrollToOffset({ offset: 0, animated: false });
  };

  const mostrarMas = () => {
    if (quedanMas) setVisibles((anterior) => anterior + BLOQUE);
  };

  if (cargando)
    return (
      <Fondo>
        <EstadoPantalla tipo="cargando" />
      </Fondo>
    );
  if (error && !jugadores.length)
    return (
      <Fondo>
        <EstadoPantalla tipo="error" />
      </Fondo>
    );

  return (
    <Fondo>
      <FlatList<Jugador>
        ref={lista}
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
              <View style={[estilos.punto, error && estilos.puntoError]} aria-hidden />
              <Text style={estilos.textoEstado}>
                {error
                  ? 'No se ha podido actualizar Firebase'
                  : `${jugadoresTexto(jugadores.length)} · desde Firebase`}
              </Text>
            </View>
            {error ? (
              <Text style={estilos.avisoError} accessibilityRole="alert">
                Mostrando la última plantilla recibida. Comprueba la conexión a internet.
              </Text>
            ) : null}
            {/* Los filtros se anuncian como pestañas: el lector de pantalla dice cuál está elegida */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.filtros}
              accessibilityRole="tablist"
            >
              {[null, ...POSICIONES].map((posicion) => {
                const activo = filtro === posicion;
                const color = posicion ? colorPosicion[posicion] : colores.cian;
                return (
                  <Pressable
                    key={posicion ?? 'todos'}
                    onPress={() => cambiarFiltro(posicion)}
                    style={({ pressed }) => [
                      estilos.chip,
                      activo && { borderColor: color, backgroundColor: `${color}26` },
                      pressed && estilos.pulsado,
                    ]}
                    accessibilityRole="tab"
                    aria-selected={activo}
                    accessibilityLabel={
                      posicion ? `Filtrar por ${posicion}` : 'Mostrar todos los jugadores'
                    }
                    testID={`filtro-${posicion ?? 'todos'}`}
                  >
                    <Text style={[estilos.textoChip, activo && { color }]}>
                      {posicion ?? 'Todos'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <EstadoPantalla
            tipo="vacio"
            texto={
              jugadores.length === 0
                ? 'Todavía no hay jugadores en la plantilla.'
                : `No hay jugadores en la posición ${filtro}.`
            }
            accion={
              filtro
                ? { texto: 'Ver toda la plantilla', alPulsar: () => cambiarFiltro(null) }
                : undefined
            }
          />
        }
        ListFooterComponent={
          filtrados.length > 0 ? (
            <View style={estilos.pie}>
              <Text style={estilos.textoPie} testID="progreso-listado">
                Mostrando {mostrados.length} de {jugadoresTexto(filtrados.length)}
              </Text>
              <Text style={estilos.textoPie}>
                {quedanMas
                  ? 'Desliza para ver más'
                  : filtro
                    ? 'Has visto todos los resultados'
                    : 'Has visto toda la plantilla'}
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
  puntoError: { backgroundColor: colores.rojo },
  avisoError: { color: colores.rojo, fontFamily: fuentes.texto, fontSize: 13, lineHeight: 19 },
  filtros: { gap: 8, paddingVertical: 6 },
  chip: {
    minHeight: medidas.toque,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.linea,
    backgroundColor: colores.vidrio,
  },
  textoChip: { color: colores.texto2, fontFamily: fuentes.textoMedio, fontSize: 13 },
  pulsado: { opacity: 0.75 },
  pie: { padding: medidas.hueco, gap: 6, alignItems: 'center' },
  textoPie: { color: colores.texto3, fontFamily: fuentes.texto, fontSize: 12 },
});
