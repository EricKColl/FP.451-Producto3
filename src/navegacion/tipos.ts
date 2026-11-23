import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Las 3 ventanas del Stack de navegación y lo que recibe cada una.
// Detalle y Multimedia reciben solo el id: leen el jugador de Firestore en tiempo real, así que
// si alguien lo cambia desde la web o la consola de Firebase, la pantalla se actualiza sola.
export type ParametrosNavegacion = {
  Inicio: undefined;
  Detalle: { id: string };
  Multimedia: { id: string };
};

// Tipo de las props de cada pantalla, por ejemplo: PropsPantalla<'Detalle'>
export type PropsPantalla<Nombre extends keyof ParametrosNavegacion> = NativeStackScreenProps<
  ParametrosNavegacion,
  Nombre
>;
