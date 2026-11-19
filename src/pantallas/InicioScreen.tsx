import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { TarjetaJugador } from '../componentes/TarjetaJugador';
import { useJugadores } from '../hooks/useJugadores';
import { PropsPantalla } from '../navegacion/tipos';
import { obtenerJugadores } from '../servicios/jugadores';
import { colores, fuentes, medidas } from '../tema/tema';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// VENTANA INICIO · Persona 2 (Jacobo). Paso 1: tarjetas conectadas al listado de Firebase.
// Conservamos la cabecera provisional; el siguiente paso incorpora título y listado por bloques.
// CONTRATO (no cambiar): se llama InicioScreen, recibe PropsPantalla<'Inicio'>, lee los datos con
// useJugadores() y navega con navigation.navigate('Detalle', { id }) y ('Multimedia', { id }).
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function InicioScreen({ navigation }: PropsPantalla<'Inicio'>) {
  const { datos: jugadores, cargando, error } = useJugadores();
  const [comprobacion, setComprobacion] = useState('Comprobando la lectura única…');

  // Funciones que pasamos a las tarjetas para que Inicio decida la navegación.
  const abrir = useCallback((id: string) => navigation.navigate('Detalle', { id }), [navigation]);
  const verVideo = useCallback(
    (id: string) => navigation.navigate('Multimedia', { id }),
    [navigation],
  );

  // Comprobación de la Fase 0 (paso 9 del enunciado): una lectura única de la colección debe
  // devolver el array completo de jugadores. Es lo que en un componente de clase iría en
  // componentDidMount; con funciones se hace en useEffect con [] (solo al mostrarse).
  useEffect(() => {
    obtenerJugadores()
      .then((lista) => {
        console.log(
          `[Firebase] lectura única: ${lista.length} jugadores`,
          lista.map((j) => j.apellidos),
        );
        setComprobacion(`Lectura única: ${lista.length} jugadores recibidos de Firestore`);
      })
      .catch((e: Error) => setComprobacion(`Error al leer Firestore: ${e.message}`));
  }, []);

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
      <FlatList
        data={jugadores}
        keyExtractor={(j) => j.id}
        ListHeaderComponent={
          <View style={estilos.aviso}>
            <Text style={estilos.titulo}>Fase 0 · Conexión y navegación</Text>
            <Text style={estilos.texto} testID="comprobacion">
              {comprobacion}
            </Text>
            <Text style={estilos.texto}>
              Tiempo real: {jugadores.length} jugadores. Pantalla provisional (Persona 2).
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TarjetaJugador jugador={item} alAbrir={abrir} alVerVideo={verVideo} />
        )}
        testID="lista-jugadores"
      />
    </Fondo>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    margin: medidas.hueco,
    padding: 14,
    gap: 6,
    borderRadius: medidas.radio,
    borderWidth: 1,
    borderColor: colores.naranja,
    backgroundColor: colores.naranjaTenue,
  },
  titulo: { color: colores.naranja, fontFamily: fuentes.titulo, fontSize: 16 },
  texto: { color: colores.texto2, fontFamily: fuentes.texto, fontSize: 13 },
});
