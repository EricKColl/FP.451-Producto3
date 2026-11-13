import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EstadoPantalla } from '../componentes/comunes/EstadoPantalla';
import { Fondo } from '../componentes/comunes/Fondo';
import { useJugadores } from '../hooks/useJugadores';
import { PropsPantalla } from '../navegacion/tipos';
import { obtenerJugadores } from '../servicios/jugadores';
import { colores, fuentes, medidas } from '../tema/tema';

// ─────────────────────────────────────────────────────────────────────────────────────────────
// VENTANA INICIO · Persona 2 (Jacobo). Versión provisional de la Fase 0.
// Sirve para comprobar la conexión con Firebase y la navegación. Jacobo la sustituye por la
// definitiva: zona del título + listado infinito con FlatList y TarjetaJugador (guía, 8.2).
// CONTRATO (no cambiar): se llama InicioScreen, recibe PropsPantalla<'Inicio'>, lee los datos con
// useJugadores() y navega con navigation.navigate('Detalle', { id }) y ('Multimedia', { id }).
// ─────────────────────────────────────────────────────────────────────────────────────────────
export function InicioScreen({ navigation }: PropsPantalla<'Inicio'>) {
  const { datos: jugadores, cargando, error } = useJugadores();
  const [comprobacion, setComprobacion] = useState('Comprobando la lectura única…');

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
          <View style={estilos.fila}>
            <Text style={estilos.nombre}>
              #{item.dorsal} {item.nombre} {item.apellidos}
            </Text>
            <Pressable
              onPress={() => navigation.navigate('Detalle', { id: item.id })}
              style={estilos.boton}
              testID={`tarjeta-${item.id}`}
            >
              <Text style={estilos.textoBoton}>Detalle</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Multimedia', { id: item.id })}
              style={estilos.boton}
              testID={`video-${item.id}`}
            >
              <Text style={estilos.textoBoton}>Vídeo</Text>
            </Pressable>
          </View>
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
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: medidas.hueco,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colores.linea,
  },
  nombre: {
    flex: 1,
    color: colores.texto,
    fontFamily: fuentes.textoMedio,
    fontSize: 14,
  },
  boton: {
    minHeight: 36,
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.lineaFuerte,
  },
  textoBoton: {
    color: colores.cian,
    fontFamily: fuentes.textoMedio,
    fontSize: 12,
  },
});
