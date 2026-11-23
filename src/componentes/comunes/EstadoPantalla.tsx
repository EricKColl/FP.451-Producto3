import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, fuentes, medidas } from '../../tema/tema';

// Mensaje a pantalla completa para los tres casos que todas las pantallas deben cubrir:
// mientras llegan los datos, si falla la conexión y si el jugador ya no existe.
type Props =
  | { tipo: 'cargando'; texto?: string }
  | { tipo: 'error'; texto?: string }
  | { tipo: 'vacio'; texto: string; accion?: { texto: string; alPulsar: () => void } };

export function EstadoPantalla(props: Props) {
  return (
    <View style={estilos.centro} accessibilityRole="summary">
      {props.tipo === 'cargando' ? (
        <ActivityIndicator size="large" color={colores.cian} />
      ) : (
        <Ionicons
          name={props.tipo === 'error' ? 'cloud-offline-outline' : 'search-outline'}
          size={44}
          color={props.tipo === 'error' ? colores.rojo : colores.texto3}
        />
      )}
      <Text style={estilos.texto}>
        {props.texto ??
          (props.tipo === 'cargando'
            ? 'Conectando con Firebase…'
            : 'No se ha podido leer la plantilla. Comprueba la conexión a internet.')}
      </Text>
      {props.tipo === 'vacio' && props.accion ? (
        <Pressable
          onPress={props.accion.alPulsar}
          style={({ pressed }) => [estilos.boton, pressed && estilos.pulsado]}
          accessibilityRole="button"
        >
          <Text style={estilos.textoBoton}>{props.accion.texto}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  texto: {
    color: colores.texto2,
    fontFamily: fuentes.texto,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  boton: {
    minHeight: medidas.toque,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.lineaFuerte,
    backgroundColor: colores.cianTenue,
  },
  pulsado: { opacity: 0.7 },
  textoBoton: { color: colores.cian, fontFamily: fuentes.tituloMedio, fontSize: 15 },
});
