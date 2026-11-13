import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { colores, medidas } from '../tema/tema';
import { ParametrosNavegacion } from './tipos';

// Botón «Inicio» del menú superior: vuelve a la ventana inicial (el listado) desde cualquier
// pantalla. popTo('Inicio') cierra las ventanas que haya abiertas encima del listado.
export function BotonInicio() {
  const navegacion = useNavigation<NativeStackNavigationProp<ParametrosNavegacion>>();
  return (
    <Pressable
      onPress={() => navegacion.popTo('Inicio')}
      hitSlop={8}
      style={({ pressed }) => [estilos.boton, pressed && estilos.pulsado]}
      accessibilityRole="button"
      accessibilityLabel="Ir al inicio"
      testID="boton-inicio"
    >
      <Ionicons name="home" size={20} color={colores.cian} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  boton: {
    // En la web la cabecera no deja margen a la derecha; en Android e iOS ya lo pone el Stack
    marginRight: Platform.OS === 'web' ? 12 : 0,
    width: 40,
    height: 40,
    minWidth: medidas.toque - 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.lineaFuerte,
    backgroundColor: colores.cianTenue,
  },
  pulsado: { opacity: 0.6 },
});
