import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colores } from '../../tema/tema';

// Fondo común de todas las pantallas: azul noche con un halo cian arriba y naranja abajo,
// como el pabellón holográfico de la aplicación web.
export function Fondo({ children }: { children: ReactNode }) {
  return (
    <View style={estilos.contenedor}>
      <LinearGradient
        colors={[colores.fondo2, colores.fondo0, colores.fondo0]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(46, 235, 252, 0.10)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255, 127, 22, 0.07)']}
        start={{ x: 0.5, y: 0.7 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo0 },
});
